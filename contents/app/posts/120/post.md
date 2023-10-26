---
title: Rails開発環境 2012初夏
time: 2012-05-20 03:22
tags: ['rails']
---

Herokuに移行したり、便利なツールを見つけて開発環境を修正したところがあるので「2012初夏バージョン」として拙者の開発環境を晒します。最後にGemfileを載せておきますが、変更したポイントは「Herokuへのデプロイ」「ソースコード公開」「ブラウザのリロードの自動化」の3つです。

### Herokuへのデプロイ

VPSでの運用はいい勉強になったものの、以下のような問題がありました。

- 構築に時間がかかりすぎる。サービス開発への熱が冷めてしまう。プログラムを書くのに専念したい。
- 既に動いているシステムに支障が出るのが怖くて、新しいツール（例えばSSLとかログサーバーとか監視サーバーとか）を入れられない。
- セキュリティの問題

なるべくサービスの開発に時間をかけたいので、こうした運用をHerokuに任せてしまうことにしました。デプロイはcapistranoのように設定ファイルを書く必要すらなく、以下のようにとても簡単です。

```
$ heroku create -s cedar
$ git push heroku master
```

ステージング環境を使いたい場合もcapistrano-ext入れて云々…みたいなのは必要なく、herokuコマンドで簡単に行えます。

```
$ heroku create -s cedar -r staging
$ git push staging master
```

として、別アプリケーションを作ることでステージング環境を作ることができます。

Herokuへの移行に伴って問題となったのが、DBでした。今まではMySQLを使っていたのですが、Herokuでは標準のDBがPostgresqlです。それまでPostgresqlは使ったことがなかったのでHomebrewでインストールしたんですがけっこう苦労しました。Herokuへの移行で環境構築に時間をとられるようではVPSからHerokuに移った意味がなくなってしまうので、ローカルのDBをSQLiteにして本番のみPostgresqlで運用するようにしました。具体的には、database.ymlを以下のように設定しました。

```
development:
  adapter: sqlite3
  database: db/development.sqlite3
  pool: 5
  timeout: 5000

test:
  adapter: sqlite3
  database: db/test.sqlite3
  pool: 5
  timeout: 5000

production:
  adapter: postgresql
  encoding: unicode
  database: xxx_production
  username: xxx
  password:
  pool: 5
  timeout: 5000
```

#### 参考

- [https://devcenter.heroku.com/articles/multiple-environments](https://devcenter.heroku.com/articles/multiple-environments)

### ソースコードの公開

自分の成果物をちゃんと他人に見える形で残そうと思い、ソースコードをGithubに公開するようにしました。公開にあたって問題となるのは、APIキーやステージング環境の認証パスワードといった機密情報の扱いでした。こうした情報をソースコードにハードコーディングせずにアプリケーションを動かす工夫が必要でした。そこで、僕は環境変数にこれらの情報を保存するようにしました。幸い、Herokuでは環境変数を簡単に設定する方法があります。

```
$ heroku config:add USERNAME=admin PASSWORD=xxx
```

そして、ローカルの開発環境でこれらの環境変数をロードするための方法としてforemanというgemを使いました。foremanはappサーバーや後述するguardなど複数のプロセスを同時に起動するのに便利なのですが、多くの環境変数をいっぺんにロードするのにも便利です。プロジェクトのルートディレクトリに.envというファイルを用意し、そこに環境変数をセットします。この.envを.gitignoreでgit管理下から除外しておけば、機密情報を公開せずにソースコードを公開することができます。

```
# Basic auth
USERNAME=admin
PASSWORD=xxx

# S3
S3_ACCESS_KEY=xxx
S3_SECRET_ACCESS_KEY=xxx
```

foremanを使ってappサーバーを起動する場合は以下のようにします。

```
$ foreman run rails s
```

また、Procfileを用意すればguardなど複数のプロセスを一度に起動できます。詳細は参考として載せたリンクを参照してください。

#### 参考

- [https://devcenter.heroku.com/articles/config-vars](https://devcenter.heroku.com/articles/config-vars)
- [https://github.com/ddollar/foreman](https://github.com/ddollar/foreman)

### ブラウザのリロードの自動化

viewやscssを編集してデザインを細かく調整する際、なんどもブラウザをリロードするのが煩わしかったのですが、最近便利なツールを見つけました。LiveReloadというツールです。chrome, firefox, safariなど各種ブラウザの拡張機能でLiveReloadをインストールし、guard-livereloadというgemを使うことで、viewやscssの変更が保存されると自動的にブラウザをリロードしてくれます。言葉で説明するより、以下の動画を見た方がわかりやすいです。

<iframe width="420" height="315" src="http://www.youtube.com/embed/EZ8vy_cNMVQ" frameborder="0" allowfullscreen></iframe>

感動的ですね！さっそく使いましょう。まずGemfileに追記します。

```
group :development do
  gem 'guard-livereload'
end
```

インストールしてGuardfileに設定を加えます。

```
$ bundle install
$ guard init livereload
```

あとは、以下の参考のリンクで各種ブラウザにLiveReloadをインストールします。

#### 参考

- [https://github.com/guard/guard-livereload](https://github.com/guard/guard-livereload)
- [https://addons.mozilla.org/ja/firefox/addon/livereload/](https://addons.mozilla.org/ja/firefox/addon/livereload/)
- [https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei](https://chrome.google.com/webstore/detail/jnihajbhpnppcggbcgedagnkighmdlei)

### Gemfile

最後に僕が使っているGemfileの基本型を載せておきますので参考にどうぞ。

```
source :rubygems

gem 'rails'

# 標準のWebrickよりもパフォーマンスがよく、passengerなどよりも導入が簡単なので採用
gem 'thin'

gem 'haml-rails'
gem 'jquery-rails'

group :assets do
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'uglifier'
end

group :development, :test do
  # HerokuのためにPostgresqlを入れるのは骨が折れるので開発時はSQLiteを採用
  gem 'sqlite3'

  gem 'rspec-rails'

  # 設定をロードしたサーバーによってテストを高速化する
  gem 'spork'

  # ファイルの変更を検知する。OSX用
  gem 'rb-fsevent'

  # テスト結果をGrowlで通知する
  gem 'growl'

  # ファイルの変更を監視してテストを自動的に実行する
  gem 'guard-rspec'

  # 設定ファイルの変更を監視してテストサーバーを再起動する
  gem 'guard-spork'
end

group :development do
  gem 'heroku'

  # 環境変数をロードして複数のプロセスを実行する作業を自動化
  gem 'foreman'

  # viewやcssの変更を監視してブラウザを自動的にリロードする
  gem 'guard-livereload'

  # デバッガー
  gem 'pry-rails'
end

group :production do
  # Herokuの標準DBはPostgresql
  gem 'pg'
end
```
