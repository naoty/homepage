---
title: websocket-railsで簡単なPush通知を実装する
time: 2013-12-03 00:58
tags: ['rails']
---


[websocket-rails](https://github.com/websocket-rails/websocket-rails)を使ってRailsでWebSocketによるPush通知を実装する話をします。

websocket-railsを使って簡単な[デモ](http://naoty-timeline.herokuapp.com/)を作ってHerokuにアップしました。Twitter Streaming APIで受け取ったデータをWebSocketでリアルタイムにクライアントへ送るものです。ソースコードも[github](https://github.com/naoty/twitter_streaming_sample)にありますので参考にどうぞ。

## セットアップ

```rb:Gemfile
gem "websocket-rails"
```

```bash
$ bundle
$ rails g websocket_rails:install
```

最後のコマンドで設定ファイルを追加し、`application.js`をクライアント側のライブラリを`require`するように変更します。

開発環境ではRack::Lockを無効にしないとエラーになるので以下のようにしておきます。

```rb:config/environments/development.rb
TwitterStreamingSample::Application.configure do
  config.middleware.delete Rack::Lock
end
```

## 実装

WebSocket接続したクライアントに対して任意のタイミングでメッセージを送りたい場合、channelというものを使うと簡単に実装できます。

```ruby:streamings_controller.rb
def create
  # ...
  WebsocketRails[:streaming].trigger "create", tweet
  head :ok
end
```

これで、"streaming"というチャネルに"create"というメッセージをtweetのデータとともに送信します。`WebSocketRails`という定数はどこからでもアクセス可能なので、任意のタイミングでチャネルにメッセージを送ることが可能です。

```coffee:streamings.js.coffee
dispatcher = new WebSocketRails("ws://#{localhost.host}/websocket")
channel = dispatcher.subscribe("streaming")
channel.bind "create", (tweet) ->
  # something
```

次にクライアント側では、まずWebSocket接続を行います。WebSocket接続はwebsocket-railsが追加する`/websocket`というパスに対してリクエストを送ります。

接続が成功するとdispatcherと呼ばれるオブジェクトを返します。このオブジェクトはWebSocketサーバーとやり取りをする中心的なオブジェクトです。`dispatcher#subscribe(チャネル名)`で特定のチャネルを購読するオブジェクトを取得できるので、あとはメッセージを受け取ったときのコールバックを設定するだけです。

### これだけ

これだけでdispatcherでsubscribeしたクライアントすべてに対してRailsからPush通知ができます。

## nginx

本番環境でnginxとともに運用する場合、nginx側の設定も必要です。nginxでWebSocketのプロキシを行うには1.3.13以降であることが必要です。

```nginx:nginx.conf
location /websocket {
	proxy_pass http://backend;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "Upgrade";
}
```

"Upgrade"というヘッダーはプロトコルをHTTPからWebSocketに変更するために必要な情報で、[RFC](http://tools.ietf.org/html/rfc6455#section-1.3)で定められています。

## Heroku

最近、HerokuがWebSocketのサポートを開始しました。ただし、まだβ版での開始なので、デフォルトのままではWebSocketを利用できません。以下のコマンドを実行するとWebSocketの機能がオンになります。

```bash
$ heroku labs:enable websockets
```

---

### 参考

- [websocket-rails/websocket-rails](https://github.com/websocket-rails/websocket-rails)
- [WebSocket proxying](http://nginx.org/en/docs/http/websocket.html)
- [Using WebSockets on Heroku with Ruby | Heroku Dev Center](https://devcenter.heroku.com/articles/ruby-websockets)
