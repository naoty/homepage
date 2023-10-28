---
title: 'blog.naoty.dev'
time: 2021-01-10 19:56
tags: ['meta', 'oss']
---

ブログのホスティングを https://naoty.dev/posts/ から https://blog.naoty.dev に移した。同時にこういったことも行った。

* はてなブログの記事とQiitaの記事を統合した。
* ブログを生成する仕組みをフルスクラッチした。
* ブログを生成するコードとブログのコンテンツを管理するリポジトリを分けた。

# 記事の統合
これまでインターネットで公開している記事ははてなブログ（はてなダイアリー）、Qiita、naoty.devの3つのサービスに分散していた。これらを統合してblog.naoty.devで公開するようにした。

理由は、自分が公開してきたテキストを手元で管理して、10年後、20年後も読めるようにしておきたかったからだ。プログラミングを始めた頃に書いたテキストが今も読めるという体験はとても尊いことなので、これを引き継いでいきたい。

# ブログを生成する仕組みのフルスクラッチ
これまでgulp -> Gatsby.js -> Nuxt.js -> Gatsby.jsとブログを生成する仕組みを作り変えてきたけど、今回は既存のフレームワークを使わずにRubyでフルスクラッチした。

https://github.com/naoty/blog

理由は、既存のフレームワークを使ってブログを作ってから長い期間が経つとフレームワークの知識を忘れてしまいメンテナンスが難しくなることがしばしばあったからだ。

そこで、一番慣れているRubyを使って可読性が高いコードを書き、仕組みを忘れてしまってもコードを読めばメンテナンスができるようにした。

# 別リポジトリでの管理
上で書いた[naoty/blog](https://github.com/naoty/blog)とは別に[naoty/posts](https://github.com/naoty/posts)というリポジトリで記事コンテンツを管理するようにした。

理由は、ブログを生成するコードとブログのコンテンツそのものの寿命が異なるからだ。ブログを生成するコードは今回5回目のリニューアルとなり、（ないとは思うけど）また別の仕組みに一新されるかもしれない。