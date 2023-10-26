---
title: Pocketのもう読んでない記事を掃除するヤツ書いた
time: 2015-07-11 16:19
tags: ['oss']
---

[naoty/sweep](https://github.com/naoty/sweep)

普段、[Pocket](https://getpocket.com)を使って「あとで読む」記事を管理している。ちょっとした時間に見つけた記事をPocketに追加しておいて、通勤時間などにiOSアプリで消化している。ただ、長い記事が増えてくるとだんだん消化しきれなくなってきて、消化しようというモチベーションが失せてくる。そこで、一定期間が経っても消化できていない記事を自動的に削除するツールを書いた。

# 使い方

1. まず、Pocketのdeveloperサイトに行ってアプリケーションを作成する。すると、Consumer keyが得られる。次に、Access tokenが必要なのだけど、これは[motemen/go-pocket](https://github.com/motemen/go-pocket)を使ってOAuth認証を行い取得した。

2. Herokuボタンからデプロイする。ここで、上で取得したconsumer keyとaccess tokenを環境変数としてセットする。さらに、削除対象とする期限を環境変数で指定できる。デフォルトは24時間となっている。僕は72時間にしている。

3. Heroku schedulerのダッシュボードで`sweep`を実行するタイミングを設定する。

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/naoty/sweep)

# 所感

先日、Herokuが公式にGoをサポートしたので、さっそくテストを兼ねてこういうものをGoで書いてみた。[tools/godep](https://github.com/tools/godep)の使い方を覚えなくてはいけないことを除けば、いつもどおりにHerokuにアプリケーションをデプロイできた。

個人的にちょっとしたCLIツールをGoで書くことが増えたが、ちょっとしたジョブを定期実行させるときにGoでちょっとしたツールを書いてHeroku schedulerにやらせるという手法は非常にお手軽なので今後も機会がありそうだなと思った。
