---
title: Herokuでhubotを使ったIRC botを動かす
time: 2012-12-30 03:41
---

最近、会社でIRCブームが来てるので、僕もhubotを使ってなにかbotを作ってみることにした。[hubot](http://hubot.github.com/)はGithubが作ったbotフレームワークで、TwitterのbotとかIRCのbotを簡単に作ることができる。

で、できたのがこれ。

![f:id:naoty_k:20121230030802p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20121230/20121230030802.png "f:id:naoty\_k:20121230030802p:plain")

[https://github.com/naoty/diobot](https://github.com/naoty/diobot)

ディオ（DIO）様の名言をランダムに返してくれる、最高に「ハイ！」なbotが出来上がりました。

Herokuでhubotをデプロイするときにhubotのwiki[\*1](#f1 "https://github.com/github/hubot/wiki/Deploying-Hubot-onto-Heroku")を参考にしてみたんだけど、Herokuにpushすると、下のようなエラーが出てぜんぜんうまくいかなかった。

```
Starting process with command `bin/hubot -a irc -n Hubot`
Stopping all processes with SIGTERM
bin/hubot: 3: npm: not found
Process exited with status 0
```

結局、このwikiは参考にせずに自力でなんとかしたので、その記録をちゃんとメモに残しておこうと思う。

## package.json

```
$ mkdir diobot
$ cd diobot
$ vi package.json
{
  "name": "diobot",
  "version": "0.0.1",
  "author": "naoty",
  "description": "DIO sama at irc",
  "license": "MIT",

  "dependencies": {
    "hubot": "*",
    "hubot-scripts": "*",
    "optparse": "*",
    "hubot-irc": "*",
    "coffee-script": "*",
    "underscore": "*"
  },

  "engines": {
    "node": "0.8.x",
    "npm": "1.1.x"
  }
}
$ npm install
```

- `dependencies`にあるパッケージは、先述のwikiに従ってたときに使ってたpackage.jsonに書いてあったのでそのまま使った。
- あと、`coffee-script`はデプロイ時にエラーになったので追加した。
- `underscore`は便利なので、とりあえず追加した。

## Procfile

```
$ vi Procfile
bot: hubot -a irc -n DIO
```

- Herokuによると[\*2](#f2 "https://devcenter.heroku.com/articles/nodejs-support")、Heroku側で`bin:node_modules/.bin:/usr/local/bin:/usr/bin:/bin`にPATHを通してくれるので、Procfileでは`hubot`とすればいい。
- `-a <Adapter名> -n <IRCのニックネーム>`をオプションにつける。

## Herokuにデプロイ

```
$ git push heroku master
...
$ heroku ps:scale bot=1
$ git config:add HUBOT_IRC_SERVER='irc.example.com' HUBOT_IRC_ROOMS='#hoge' HUBOT_IRC_NICK='DIO' HUBOT_IRC_PORT='6667' HUBOT_IRC_PASSWORD='hogehoge'
```

- IRCサーバーやチャンネルへの接続のための情報を環境変数として渡す。
- 必要な情報はこちら[\*3](#f3 "https://github.com/github/hubot/wiki/Adapter:-IRC")に載ってる。

## スクリプトを追加

```
$ mkdir scripts
$ vi scripts/ping.coffee
module.exports = (robot) ->
  robot.respond /PING$/i, (msg) ->
    msg.send 'PONG'
```

- `scripts/`以下にあるスクリプトは自動で読み込まれて有効になる。
- これをデプロイして`dio ping`って送ったら`PONG`とDIOが返したら成功。
- あとは、工夫して面白いbotを作るだけ。

Enjoy!

[\*1](#fn1):[https://github.com/github/hubot/wiki/Deploying-Hubot-onto-Heroku](https://github.com/github/hubot/wiki/Deploying-Hubot-onto-Heroku)

[\*2](#fn2):[https://devcenter.heroku.com/articles/nodejs-support](https://devcenter.heroku.com/articles/nodejs-support)

[\*3](#fn3):[https://github.com/github/hubot/wiki/Adapter:-IRC](https://github.com/github/hubot/wiki/Adapter:-IRC)
