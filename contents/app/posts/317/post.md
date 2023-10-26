---
title: スキーマファイルをSQL形式に変更する
time: 2018-01-13T09:53:00+0900
description: スキーマファイルのと実際のスキーマの乖離を避けるためSQL形式に変更する
tags: ["rails"]
---

Railsアプリのスキーマファイルはデータベースの現在のスキーマを表し、デフォルトでは`db/schema.rb`にActiveRecordのDSLで記述されている。スキーマファイルは`rails db:schema:dump`で生成されるものなので、開発者が直接いじってはならない。

開発が進みデータベースのスキーマが複雑になると、ActiveRecordのDSLでの表現に限界が出てくる。DSLのメリットはデータベースに依存せず抽象的な表現ができることだが、データベース固有の設定をする場合にDSLで表現できなくなってくる。

DSLで表現できなくなるとスキーマファイルと実際のスキーマに乖離が生まれる。スキーマに乖離があると、開発環境やCI上でデータベースをセットアップするのが困難になる。

そこで、ActiveRecordはスキーマファイルの形式にSQLを選ぶことができる。`config/application.rb`で以下のように指定すると、`db/structure.sql`というSQL形式のスキーマファイルが生成される。

```ruby
config.active_record.schema_format = :sql
```

なお、この設定はデフォルトでは`:ruby`が指定されている。

SQL形式に変更した場合、コマンドを以下のように変える必要がある。

| Ruby形式               | SQL形式                   |
| ---------------------- | ------------------------- |
| `rails db:schema:load` | `rails db:structure:load` |
| `rails db:schema:dump` | `rails db:structure:dump` |

また、`db/structure.sql`の生成にはDBごとのスキーマダンプツールを使うため、MySQLであれば`mysqldump`を用意する必要がある。
