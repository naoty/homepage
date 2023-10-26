---
title: Homebrewで自作Formulaを作るときの落とし穴
time: 2017-02-20 22:30
---

[naoty/todo](https://github.com/naoty/todo) という CLI ツールを Homebrew で配布しようとしたときにハマったことを書く。

naoty/todo は Go で書かれており、コンパイル済みのバイナリを GitHub Releases にアップロードしてそこから配信したいと思っていた。ドキュメント等を調べると以下のように formula を書くことでインストールが完了するものと思っていた。

```
class Todo < Formula
  desc "A todo management tool just for myself"
  homepage "https://github.com/naoty/todo"
  url "https://github.com/naoty/todo/releases/download/0.2.0/todo.tar.gz"
  sha256 "be20e4069c0ae49998dfc00a010ca8f5d49d26193bd0c3e8611a4bf53cac469d"

  def install
    bin.install "todo"
  end
end
```

しかし、実際には `Empty installation` というエラーが発生してインストールができない現象に遭遇した。ドキュメントを調べてみるも、なぜこれが失敗するのか突き止めることはできなかった。そこで、エラーメッセージを頼りに Homebrew のソースコードを読むことにした。

まず、 Homebrew のソースコードは `/usr/local/Homebrew/Library/Homebrew` にある。そこで ag で `Empty installation` というエラーメッセージを検索してみると、以下のようなコードを見つけることができた。

```
if !formula.prefix.directory? || Keg.new(formula.prefix).empty_installation?
  raise "Empty installation"
end
```

ここからは `pry` を使ってブレークポイントを貼りながら進めようと思った。 Homebrew はシステムの Ruby を使っているようなので、 システムの rubygems で pry をインストールし調査を続けた。

`binding.pry` で調べたところ、 `empty_installation?` が `true` を返しているようだった。このメソッドの中身は以下のようになっていた。

```
def empty_installation?
  Pathname.glob("#{path}/**/*") do |file|
    next if file.directory?
    basename = file.basename.to_s
    next if Metafiles.copy?(basename)
    next if %w[.DS_Store INSTALL_RECEIPT.json].include?(basename)
    return false
  end

  true
end
```

さらにここでイテレーションされている `file` を調べると formula でインストールした `todo` と `README` 等のファイルが含まれていた。ここで何が原因か調べてみると、どうやら以下のように `todo` が README や LICENSE といったメタファイルのひとつとして扱われていて、ここで `true` が返っているようだった。

```
BASENAMES = Set.new %w[
  about authors changelog changes copying copyright history license licence
  news notes notice readme todo
].freeze
```

ということは、メタファイルではないものがひとつでも存在すれば `true` が返るということなので、以下のような formula を定義して適当なファイルを置くことで、この問題を回避することができた。

```
def install
  bin.install "todo"

  # Avoid "Empty installation" error which will be caused when the only
  # "todo" file is installed.
  bin.install "empty"
end
```

この問題は `license` や `changelog` といった名前のパッケージを配布する場合でも起こる。ソースコードを読まないと原因が分からないので、同じ問題に直面した人は不運という感じがする。
