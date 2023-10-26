---
title: ブログで使うライブラリのアップデートを自動化する
time: 2018-12-12T22:16:00+0900
description: dependabotを使ってGitHub Pageのビルドに使うライブラリのアップデートを自動化した話
tags: ["meta"]
---

このブログはGatsby.jsでビルドしてGitHub Pagesにホスティングしているんだけど、ビルドするために必要なライブラリを[dependabot](https://dependabot.com/)を使って自動的にアップデートするようにしたところ、とても快適になった。

dependabotはOSSであれば無料で使うことができる。設定したスケジュールに従ってライブラリのアップデートが存在すれば以下のような感じでPull requestを自動的に送ってくれる。

![](pull_requests.png 'dependabotが送ってきたPull Request')

さらにとてもよかったのが、マイナーアップデートであれば自動的にPull requestをmergeするといった、auto mergeの条件を細かく設定できたことだ。これによって大幅に運用の手間が抑えられる。

このブログでは、`package.json`で指定したversion specifierに従ったアップデートは自動的にmergeするようにし、そうでないメジャーアップデートなどは手動でmergeするようにしている。ちょうどさきほど[emotion](https://emotion.sh/)のメジャーアップデートを手動でmergeしていたところだった。breaking changeを含んでいたため、auto mergeにしないで正解だった。

ライブラリのアップデートは忘れがちで、気づいたときにアップデートしようとすると大幅な変更を余儀なくなってしまう。GitHub Pagesで自分のページを運用している開発者にはdependabotのようなサービスをオススメしたい。
