---
title: Qiita Hackathon参加してきました
time: 2012-12-09 00:21
tags: ['diary']
---

[Qiita Hackathon](http://qiitahackathon02.peatix.com/)に参加してきました。

「[HeartBeat](http://quiita-hackson-heartbeat.herokuapp.com)」というアプリを7時間あまりで作りました。Androidの加速度センサーとnode.jsを使ったアプリで、スマホの振動を定期的にサーバーに送信することで、その人の活動状況（生きてんのか、死んでんのか）をリアルタイムに把握できます。毒のあるデザインが味わい深さを際立たせています。

![f:id:naoty_k:20121208234807g:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20121208/20121208234807.gif "f:id:naoty\_k:20121208234807g:plain")

↑スマホの振動によって生死を彷徨う様子がリアルタイムで更新される図

結果的には入賞を逃しましたが、得ることが多かったのでメモを残しておこうと思います。

## 技術的なアレコレ

- 時間節約のために使ったLoginActivityのテンプレートが便利だった。ログイン画面が一瞬でできあがった。バリデーションや非同期処理も完璧に書いてあって、UIもキレイな優れもの。これはいい教材になりそう。
- 加速度センサーをネイティブで実装したけど、他のチームがHTML5+JSで実装していた。HTML5でできることを知っていれば、Javaはいっさい書かずにこのアプリできた気がする。日頃ネイティブで開発しているせいか、HTML5についてまったくといっていいほど関心がなかった。反省。
- 僕たちのチーム以外にも「加速度センサー＋リアルタイム」なアプリがいくつかあった。やはり、node.jsのようなリアルタイムウェブの技術があると、実現できるアイデアの幅が広がると改めて感じた。やりたいとは前々から思ってたけど、その優先度を上げようと思う。
- [DeployGate](https://deploygate.com)マジ便利。TestFlightもかなり便利だったけど、それ以上に使いやすかった（iOSはAndroidより配信までのプロセスが多いことが主因だけど）。デプロイまでのプロセスがとても短い。よく考えられてると感じた。ただ、うちの会社で使うかはちょっと微妙かもしれない。配信だけならJenkinsを使って簡易な仕組みはできそう。たくさんの端末で検証する場合であれば、各機種の詳細なログがほしいのでDeployGate使うと思う。

## ハッカソンについて

- ハッカソンではWebViewを使うのが簡単で速いと思った。
- ハッカソンでよくやるミスとしては、ログイン／サインインの実装に時間をとられること。本来作りたい機能以外で時間をとられて悲しくなる。やめよう。ユーザーはHTMLでいるっぽい感じにしちゃえ。作りたい機能に集中した方がいい。
- ハッカソンのいいところは、いろんなアプリの実装方法をその場で知ることができる点にあると思う。同じようなアプリでもネイティブで作るチームとHTML+JSで作るチームがある。出来上がりを見ても、そこに大差はない。いろんな実装方法を知ることで、選択肢が広がり、目的に対してより適切な選択ができるようになると思う。
