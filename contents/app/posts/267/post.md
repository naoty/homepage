---
title: コマンドラインを拡張しやすくするヤツ書いた
time: 2015-07-14 10:15
tags: ['oss']
---

gitなど既存のコマンドラインを拡張して新しいサブコマンドを追加する方法はいくつか考えられる。

# git alias

gitの場合は`git alias`を使うことで簡単にサブコマンドを追加できる。gitのとき限定。

# ラッパー

[github/hub](https://github.com/github/hub)のような既存のコマンドラインをラップしたスクリプトを書き、`alias hub=git`のように`alias`することで既存の機能を保ちつつ機能を追加できる。

問題点としては、複数のラッパーによる拡張が難しくなる。例えば、ここで`bub`という`git`のラッパーを書いたとする。`git`に`hub`の機能と`bub`の機能を拡張したい。`hub`は入力されたサブコマンドが`hub`になければ`git`にフォワードしている。なので、`hub`と`bub`を同時に拡張するには`bub`を`hub`のラッパーとして実装することになってしまう。依存関係をハードコーディングすることになるため、まったくスケーラブルじゃない。

# 命名規則とext

`command subcommand`と入力されたら`command-subcommand`を実行するように名前解決する仕組みがよさそうだと思う。例えば、`git pr`というコマンドはまず`git-pr`を探し、あれば実行し、なければ`git pr`を実行する（そしてエラーになる）。`gem uninstall all`というコマンドは`gem-uninstall-all`、`gem-uninstall all`、`gem uninstall all`の順に探索されて見つかり次第実行される。

このような命名規則を基に名前解決するツールを書いた。

[naoty/ext](https://github.com/naoty/ext)

```
$ go get github.com/naoty/ext
$ go get github.com/naoty/gem-uninstall-all
$ alias gem="ext gem"
$ gem uninstall all # Run gem-uninstall-all
```

正直、いろんな問題がありえそうだが、昨日思いついたままに書いたものなので、まだ想定できてない。`gem-uninstall-rails`というコマンドがあったらrailsをアンインストールできないとかありそう。

上の例で、`hub`と`bub`を同時に拡張したい場合に`ext`を使うと以下のようにできる。

```
$ go get github.com/naoty/hub-bub
$ alias git="ext hub"
$ git bub # Run `hub-bub`
```

残念ながら、`hub`を使いたい場合はこうするしかないような気がする。

* * *

# 追記(2015-07-23)

gitには、`git subcommand`を`git-<subcommand>`として名前解決して実行する機能があったことをさっき知った。なので、gitに限って言えばextのようなツールは不要だと思う。

```
$ cd $HOME/bin
$ vi git-hello
#!/bin/sh

echo "Hello, world!"
$ chmod +x git-hello
$ git hello
Hello, world!
```
