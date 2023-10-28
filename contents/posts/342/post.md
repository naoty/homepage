---
title: ブログをGatsby.jsで書き直した
time: 2018-09-01T11:54:00+0900
description: Gatsby.jsの感想やGatsby.jsに興味を持つきっかけとなったJAMstackの話
tags: ["meta", "gatsby"]
---

このブログを[Gatsby.js](https://www.gatsbyjs.org)で書き直した。昨年11月にこのブログを作ったときはgulpとejsを組み合わせて自作していたんだけど、Gatsby.jsの練習のために作り直すことにした。

## JAMstack
Gatsby.jsの練習をすることにしたきっかけとしては、[JAMstack](https://jamstack.org/)という考え方を知り興味を持ったことだった。JAMstackを簡単に説明すると、Webアプリケーションを作るときの以下のような方針のことを指しているんだと理解している。

* サーバーサイドでHTMLをレンダリングしない。事前にHTMLをビルドして静的ファイルとしてCDNから配信する。
* データの取得はすべてクライアントサイドから行う。

どこまでこの考え方が有効なのか分からないけど、ポストRailsの時代を見据えたときに筋の良さを感じたので、実践してみようと思った。

JAMstackを実践するにあたって必要な静的サイトジェネレータの練習として、ブログをGatsby.jsで作ってみたということになる。

## Gatsby.jsの感想
Reactは多少触っていたので、チュートリアルを一通りやればあとはすんなりブログの開発を進めることができた。WebpackとかBabelの面倒な設定は不要だったので、Reactの初心者でも扱えそうな気がした。

また、Gatsby.jsではHTMLのビルド時に必要なMarkdownで書いたコンテンツやサーバーにあるデータはすべてGraphQLで取得するようになっているため、GraphQLの雰囲気をつかむのにもよかった。GraphQLの仕様とかあんまりわかってなくても問題なかった。