---
title: tm_twitter_apiでうまく認証できない
time: 2011-07-24 23:51
tags: ['titanium']
---

> [tm\_twitter\_api - github](https://github.com/mogya/tm_twitter_api)

```
// Resources/app.js
var path_lib = '';
Titanium.include('lib/twitter_api.js');
Titanium.App.twitterApi = new TwitterApi({
	consumerKey: 'MY CONSUMER KEY',
	consumerSecret: 'MY CONSUMER SECRET'
});
var twitterApi = Titanium.App.twitterApi
twitterApi.init();
```

- 認証ページでアカウント名とパスワードを入力し「連携アプリを認証」ボタンをおすと、なぜか[http://mobile.twitter.com/](http://mobile.twitter.com/)にリダイレクトされる（下画像）。モーダルウィンドウはいっこうに閉じない。

[![f:id:naoty_k:20110724235009p:image](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20110724/20110724235009.png "f:id:naoty\_k:20110724235009p:image")](http://f.hatena.ne.jp/naoty_k/20110724235009)
