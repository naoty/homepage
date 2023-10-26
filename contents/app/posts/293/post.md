---
title: Swiftのオブジェクトグラフを生成する flock を作った
time: 2017-03-13 23:17
tags: ['oss']
---

[naoty/flock](https://github.com/naoty/flock)

Swift で定義されたオブジェクト間の依存関係を可視化する flock というツールを作った。これによって、 Swift で書かれたコードベース全体を把握しやすくなったり、リファクタリング時に影響範囲を把握しやすくなる。

# Usage

Homebrew からインストールできる。

```
$ brew tap naoty/misc
$ brew install flock
```

flock は指定したディレクトリ（何も指定しなければカレントディレクトリ）以下の Swift のソースコードを解析して dot 形式のソースコードを出力する。これを Graphviz 等を用いて画像に出力して使う。

```
$ flock <directory>
```

試しに [Alamofire](https://github.com/Alamofire/Alamofire) で flock を試してみた。

![f:id:naoty_k:20170313230437p:plain](https://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20170313/20170313230437.png "f:id:naoty\_k:20170313230437p:plain")

横長になってしまうので、一部を切り取った。

![f:id:naoty_k:20170313231019p:plain](https://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20170313/20170313231019.png "f:id:naoty\_k:20170313231019p:plain")

コードの依存関係がハッキリと把握できるようになった。

# How it works

Objective-C では [nst/objc\_dep](https://github.com/nst/objc_dep) というツールがあった。これはシンプルな Python によるスクリプトでありながら、コードベースを把握する上で強力なツールだった。しかし、 Swift は Objective-C よりも文法がはるかに複雑なため、正規表現で依存関係を抽出するのは困難だ。

幸いにも、 Apple は SourceKit という IDE のためのフレームワークを OSS として公開している。これを使うことで、正規表現によるパースなしに Swift のソースコードの AST を抽出することができる。 SourceKit を使った有名なツールに [realm/SwiftLint](https://github.com/realm/SwiftLint) がある。

flock では、間接的に SourceKit を使っている。間接的に、というのは SourceKit を Swift から扱いやすくする [jpsim/SourceKitten](https://github.com/jpsim/SourceKitten) を使っているからだ。 flock は SourceKitten が提供する情報をもとに dot ファイルのソースコードを生成している。

# 課題

現状では、 `[String]`, `String?`, `Set<String>` といった Compound Type を扱えていないため、依存関係の一部分しかグラフにできていない。 SourceKitten がこうした型を扱えていないため、 SourceKit を直接扱うか、こちら側でなんとかパースするかすることになりそう。
