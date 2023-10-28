---
title: SinatraでのRABLの使い方
time: 2012-10-26 00:03
tags: ['sinatra']
---

## RABLとは…

- [https://github.com/nesquena/rabl](https://github.com/nesquena/rabl)
- jsonでのレスポンスを簡単に書くためのテンプレートエンジンみたいです。
- ちょっとしたAPIサーバーをSinatraで作るときにRABLを併用することはありそう。

## インストール

```ruby:Gemfile
source :rubygems

gem 'sinatra'
gem 'rabl'
```

```sh
$ bundle install
```

## 基本

```ruby:my_app.rb
class MyApp < Sinatra::Base
  Rabl.register!

  set :rabl, :format => :json

  get '/' do
    get :rabl, :home
  end
end
```

```views/home.rabl
node(:greeting) do
  'Hello, Sinatra with RABL!'
end
```

```sh
$ curl http://myapp.dev
{"greeting":"Hello, Sinatra with RABL!"}
```

## レイアウト

- APIのレスポンスとしては、ステータスコードなどのメタ情報をすべてのレスポンスに共通して含めたい。
- なので、Sinatraのテンプレートを使ってみる。

```ruby:views/layout.erb
{
  "status": <%= response.status %>,
  "result": <%= yield %>
}
```

```ruby:my_app.rb
get '/' do
  render :rabl, :home, :layout_engine => :erb
end
```

```sh
$ curl http://myapp.dev
{
  "status": 200,
  "result": {"greeting":"Hello, Sinatra with RABL!"}
}
```

- RABLの[wiki](https://github.com/nesquena/rabl/wiki/Using-Layouts)にあるように、ruby 1.9.xではRABLでレイアウトを書けないので、erbを使う。
- レスポンス本体とレイアウトのエンジンが異なる場合は、`:layout_engine => :erb`と指定する必要があるっぽい。
