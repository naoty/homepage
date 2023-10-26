---
title: Rubyの型に入門する
description: Rubyの型シグネチャや型検査器にさわってみた話です
time: 2020-03-10 20:02
tags: ["ruby"]
---

最近、Rubyを書いてなかったので前から興味があった型に入門してみた。

# 型シグネチャを書く
型シグネチャファイルの拡張子は`*.rbs`とのこと。型シグネチャの書き方は[ここ](https://github.com/ruby/ruby-signature/blob/master/docs/syntax.md)を見たり、[実際の例](https://github.com/ruby/ruby-signature/tree/master/stdlib/builtin)を見るとわかってくる。

```rb
class Pokemon
  @id: Integer
  @name: String

  def initialize: (String name) -> void
end
```

# 型検査器をつかう
適当に空のクラスを用意して試してみる。

```rb
class Pokemon
end
```

`Steepfile`というファイルに検査したいコードのディレクトリと型シグネチャが入っているディレクトリを指定する。

```rb
target :lib do
  check "lib"
  signature "sig"
end
```

ディレクトリ構成はこんな感じ。

```bash
% tree .
.
├── Gemfile
├── Gemfile.lock
├── Steepfile
├── lib
│   └── pokemon.rb
└── sig
    └── pokemon.rbs
```

`steep check`で型検査を実行できる。ちゃんとメソッドがないことと怒られるようになった。

```bash
% bundle exec steep check
lib/pokemon.rb:1:0: MethodDefinitionMissing: module=::Pokemon, method=initialize (class Pokemon)
```
