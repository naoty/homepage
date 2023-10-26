---
title: Hello, Sinatra! (1)
time: 2012-10-08 23:11
tags: ['sinatra']
---

いまさらSinatraを始めてみた。

## モチベ

- 個人で新しい何かを作り始めた。個人でやるからには、仕事じゃ使えないけど気になってる技術を使った方がいいので、RailsじゃなくてSinatraを使ってみることにした。
- Railsやってると、あんまりRackとか下のレイヤーを意識しないので、そこらへんに前から興味があった。
- Sinatraがダメだったら、Padrinoやるかも。

## versions

- 2012年10月7日時点で最新のもの

## sinatra install

```
# Gemfile

source :rubygems

gem 'sinatra'
```

```
$ bundle install --path vendor/bundle --binstubs
```

- とりあえずRailsのときと同様に`vendor/bundle`以下に入れる。

```
# app.rb

require 'bundler'
Bundler.require

get '/' do
  'Hello, Sinatra!'
end
```

```
$ ruby -rubygems app.rb
```

- [http://localhost:4567](http://localhost:4567) で起動を確認。
- スモールスタートがいい。

## rabl

```
# Gemfile

source :rubygems

gem 'sinatra'
gem 'rabl'
```

```
$ bundle
```

- JSONのレスポンスをテンプレートで記述したかったので`rabl`をインストール

```
# app.rb

require 'bundler'
Bundler.require

Rabl.register!

get '/' do
  render :rabl, :home, :format => :json
end
```

```
# views/home.rabl

node(:greeting) do
  'Hello, Sinatra with rabl!'
end
```

- 最近、rabl開発メンバーがsinatraに公式サポートのpull requestを送って、sinatraでrablが公式にサポートされるようになったっぽい。
- そのせいか、公式ドキュメント通りではうまくいかず結構時間かかった。

## config.ru

```
# config.ru

require 'bundler'
Bundler.require

require './app'
run App
```

```
# app.rb

require 'sinatra/base'

class App < Sinatra::Base
  Rabl.register!

  get '/' do
    render :rabl, :home, :format => :json
  end
end
```

- Herokuやpowで起動する際config.ruが必要っぽい。
- `run [app name]`は必須。これがないと動かない。

## pow

```
# Gemfile

group :development do
  gem 'powder'
  gem 'guard-pow'
end
```

```
$ bundle
$ powder link
$ guard pow init
```

- sinatraでは、ファイルを変更するたびにサーバーを再起動する必要があってめんどくさい。
- そこで、guard-powを使うことでその作業を自動化する。
- Guardfileはこんな感じにしてみた。

```
# Guardfile

guard 'pow' do
  watch('Gemfile')
  watch('Gemfile.lock')
  watch('app.rb')
  watch('config.ru')
end
```

## heroku & thin

```
# Gemfile

group :production do
  gem 'thin'
end

group :development do
  gem 'heroku'
  gem 'powder'
end
```

```
# Procfile

web: thin start -p $PORT -e $RACK_ENV
```

- herokuはすんなりデプロイできた。
- developmentはpowサーバを使うのでproductionのみthinをインストール。
- Procfileにwebを書いておくと、Herokuのデフォルトのアプリケーションサーバを変更できる。デフォルトはWEBRickなのでthinに変える。thinの方がパフォーマンスがいいらしい。

## activerecord

```
# Gemfile

gem 'sinatra-activerecord'
gem 'rake'

group :production do
  gem 'pg'
end

group :development, :test do
  gem 'sqlite3'
end
```

```
$ bundle
```

- sinatraで使えるactiverecordと各環境用のアダプターをインストール。

```
# Rakefile

require 'bundler'
Bundler.require

require 'sinatra/activerecord/rake'
require './app'
require './config/environment'
```

```
$ rake -T
rake db:create_migration
rake db:migrate
rake db:rollback
```

```
# config/environment.rb

require 'uri'

configure :development do
  set :database, 'sqlite:///db/development.db'
end

configure :test do
  set :database, 'sqlite:///db/test.db'
end

configure :production do
  db = URI.parse(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

  ActiveRecord::Base.establish_connection(
    :adapter => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
    :host => db.host,
    :port => db.port,
    :username => db.user,
    :password => db.password,
    :databasee => db.path[1..-1],
    :encoding => 'utf8'
  )
end
```

- githubの[README](https://github.com/janko-m/sinatra-activerecord)にしたがってRakefileで必要なものを`require`すると、マイグレーションができるようになる。
- sqliteのパスは`///`とスラッシュ3つなのが注意。
- heroku用の設定はherokuのdevcenter（[ここ](https://devcenter.heroku.com/articles/rack)）で紹介されたものをコピペした。

```
$ rake db:create_migration
$ rake db:migrate
```

- ちなみにテストなど環境を指定する場合は`RAILS_ENV`の代わりに`RACK_ENV`を使う。

```
$ rake db:migrate RACK_ENV=test
```

```
$ git push heroku master
$ heroku run rake db:migrate
Running `rake --trace db:migrate RACK_ENV=production` attached to terminal... up, run.1
** Invoke db:migrate (first_time)
** Execute db:migrate
rake aborted!
could not connect to server: Connection refused
        Is the server running on host "localhost" and accepting
        TCP/IP connections on port 5432?
```

- DBに接続できない。。。

* * *

連休やったのはここまで。 時間があれば(2)もやる予定。
