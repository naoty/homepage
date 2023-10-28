---
title: ハッカソンでgithub連携のnode.jsアプリ作った話
time: 2013-02-03 23:52
tags: ['diary']
---

疲れたので手短に。

土日2日間ぶっ通しのハッカソンでnode.jsを使ったgithub連携アプリを作った。仕事はRailsで、まともなアプリをnode.jsで書いたことなかったし、せっかくだからnode.js使ってみた（っていうか、勝ちに行っても勝つ見込みないから、楽しむことに専念した）。

ソースコードはこちら。

[https://github.com/naoty/arounds](https://github.com/naoty/arounds)

Express 3.x, MongoDBでHerokuにデプロイしてます。

## github認証

認証ライブラリはいろいろあるようだけど、[Passport](http://passportjs.org/)を使ってみた。github認証したい場合は[passport-github](https://github.com/jaredhanson/passport-github)というものがあるので、それを併用する。使い方は載ってるので割愛。

まだnode.jsでのセッションの取り扱いとかちゃんと理解してないから、`passport.serializeUser`らへんがよくわかってない。

## mongoose, MongoLAB

MongoDBのORMとして[mongoose](http://mongoosejs.com/)を使った。Heroku上のMongoDBにはMongoLABを使った。ブラウザからコレクションの中身とか見れるのでよかった。

```
$ heroku addons:add mongolab:starter
```

## 環境ごとの設定

github APIのclient IDやDBのホストのために環境ごとに設定ファイルを用意した。

```
// app.js

require config = process.env.NODE_ENV == 'production' ? require('./config/production') : require('./config/development');
```

```
// configs/production.js

module.exports = {
    github: {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    mongodb: {
        path: process.env.MONGODB_URI || process.env.MONGOLAB_URI
    }
};
```

本番環境ではAPIキーをHerokuの環境変数を経由して参照する。

```
// configs/development.js

module.exports = {
    github: {
        clientID: 'GITHUB CLIENT ID',
        clientSecret: 'GITHUB CLIENT SECRET',
        callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    },
    mongodb: {
        path: 'mongodb://localhost/arounds'
    }
};
```

ソースコードを公開する場合は、APIキーを隠すためにconfig/development.jsを.gitignoreに追加しておく。

## まだよくわかってないこと

とりあえずnode.jsでアプリを作ってみてわかんなかったところをメモ。

### MVCな書き方

Expressは放っておくと、ルーティングやルーティングに対するアクション、モデルの定義などいろんなものをapp.jsに書くことができてしまう。viewは分かれてるけど。Rubyで言うと、RailsよりはSinatraが近い。簡単なアプリケーションなら1ファイルにまとめてしまった方がラクかもしれないけど、すぐにMVCが崩壊してしまう。

また、socket.ioを使ったコードを書くとき、view側のjavascriptにも複雑なロジックを書くことになる。

### コールバック地獄

上のにも関連するけど、あっという間にコールバック内にコールバックを書いて、その中にコールバックを書くケースが出てくる。deferというものを教えてもらったので、それ使ってみたい。

### ミドルウェア

`app.use()`みたいなのがたくさんあるけど、あれらが何をやってるのかまだよくわかってない。`express new`すると勝手にできてしまうから、あんまり意味を考えなくても動く。`express new`に頼らずに書いて覚える。
