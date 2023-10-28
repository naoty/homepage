---
title: バックエンドAPI用のテンプレートを作り始めた
time: 2014-07-21 22:54
tags: ['oss']
---

モバイルアプリケーションやJavaScriptアプリケーションのバックエンドとして使うAPIのテンプレートを作り始めた。

[https://github.com/naoty/metallic](https://github.com/naoty/metallic)

まだそんなにできてないけど、連休終わるので進捗を書いておく。まだ公開できるレベルではないので公開はしてない。

# 動機

iOSアプリのバックエンドをサクッと作りたい、でも単なるデータストアとしてではなくて少しロジックを実装したい、ってときにMBaaSを使うよりも自分でサーバーサイドを実装したくなる。そのとき、RailsかSinatraかを選ぶことになる。Railsでももちろん問題ないのだけど、必要十分な処理さえしてくれればいいという思いからSinatraを選びたくなる。だけど、Sinatra単独でバックエンドを実装するのにはかなり時間がかかる。例えば、データベースとの接続やマイグレーションの管理、JSONのパースと出力などなど、地味に大変な実装をこなさないといけない。そこで、SinatraベースでバックエンドAPIを実装するためのテンプレートを作ることにした。

# 現時点での機能

- `metallic new APPLICATION_NAME`: テンプレートからプロジェクト作成する。
- `metallic generate controller RESOURCE_NAME`: テンプレートからコントローラーを作成する。コントローラーはSinatra::Baseを継承したRESTful APIを持つクラス。作成されたコントローラーは自動的にRackミドルウェアとしてuseされる。
- `metallic generate model RESOURCE_NAME`: テンプレートからモデルとマイグレーションを作成する。今のところORMはActiveRecord固定で、DBもSQLite3固定になってる。ここはRailsみたいにオプションで切り替えられるようにしたい。Rakefileもテンプレートについてくるので、そのまま`rake db:migrate`できる。

## 使用例

```
$ metallic new todo
      create todo/Gemfile
      create todo/Rakefile
      create todo/app/application.rb
      create todo/config.ru
      create todo/config/database.yml
$ cd todo
$ bundle install
$ metallic generate controller tasks
      create app/controllers/tasks_controller.rb
$ metallic generate model Task
      create app/models/task.rb
      create db/migrations/20140721224324_create_tasks.rb
$ rake db:migrate
== 20140721224324 CreateTasks: migrating ======================================
-- create_table(:tasks)
   -> 0.0011s
== 20140721224324 CreateTasks: migrated (0.0012s) =============================
$ rackup
[2014-07-21 22:43:34] INFO WEBrick 1.3.1
[2014-07-21 22:43:34] INFO ruby 2.1.2 (2014-05-08) [x86_64-darwin13.0]
[2014-07-21 22:43:34] INFO WEBrick::HTTPServer#start: pid=20212 port=9292
```

```
$ curl http://localhost:9292/tasks
GET /tasks
```

# 実装予定

- 各種必要なRackミドルウェア: bodyのJSONをパースするヤツ、パラメータをパースしてヘルパーからページ番号やソートにアクセスできるようにするヤツ、例外をキャッチして適切なステータスコードを返すヤツ、整形されたJSONを返すヤツ、などをRackミドルウェアとして実装したい。
- 他DB対応: `generate`コマンドのオプションでテンプレートを切り替えられるようにしたい。
- あと、方針を決めかねているけど、Railsと組み合わせて使えるようにしたい。というのも、モバイルアプリケーションのバックエンドとしてだけじゃなくてJavaScriptアプリケーションのバックエンドとしても使えるようなものを目指しているので、部分的にmetallicアプリケーションをRailsアプリケーションにマウントさせる、みたいな使い方も考えられそう。なので、そういう場合を想定したテンプレートを考えたい。
