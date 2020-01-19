---
title: naoty/esa-history
time: 2020-01-19 18:01
tags: ["oss"]
---

[esa-history](https://github.com/naoty/esa-history)というesaの閲覧履歴を管理するChrome拡張を作った。最新5件の閲覧履歴を保存し、メニューからアクセスできるようにする。

自分のために書いたので、Chromeウェブストアには公開していない。ただ、Chromeの開発者モードを有効にすれば、GitHubの[Release](https://github.com/naoty/esa-history/releases/latest)にアップロードしてあるものをインストールできる。

# きっかけ
転職を機にドキュメント管理がConfluenceからesaに替わった。Confluenceの便利だった機能のひとつに閲覧履歴に簡単にアクセスするショートカットがあった。あの機能をヘビーユースしていたので、esaでも同じような体験ができるようにChrome拡張を作ってみた。

# Chrome拡張の開発
[公式ドキュメント](https://developer.chrome.com/extensions)や[APIドキュメント](https://developer.chrome.com/extensions/api_index)を読んでChrome拡張の開発方法を理解した。

ポップアップ画面をVueで実装したんだけど、CSPに準拠していないコードはChrome拡張に含められないので、完全ビルドのVueを使うことができない。なので、webpackを使ってvue-loaderで変換したコード + ランタイム限定ビルドを含めるようにする。
