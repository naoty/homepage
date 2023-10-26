---
title: cui-about.meをリリースしました
time: 2012-07-17 22:15
---

### 使い方

```
$ curl http://cui-about.me/naoty
name = naoty
blog = http://naoty.hatenablog.com
email = naoty.k@gmail.com
github = naoty
twitter = naoty_k
```

- CUI版のabout meです。
- curlコマンドでユーザーのプロフィール情報をダウンロードできます。
- 詳しい使い方は[こちら](https://github.com/naoty/cui-aboutme)に載せました。

### 作った理由

- Java疲れ
- プログラマーがよく使うabout meみたいな定番サービスがなかったので作った。
- [manualhub](http://manualhub.herokuapp.com/manualhub)というサービスを見つけて面白いと思ったものの使いにくかったので、似たようなものを自分なりに作ってみた。

### 使った技術要素

- Rails 3.2.6
- MongoDB
- Heroku (addons: MongoHQ, Custom Domain)
- お名前.com
