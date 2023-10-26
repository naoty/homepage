---
title: MySQLコンテナの起動時にDBを初期化する
time: 2019-04-28T16:18:00+0900
tags: ["db", "docker"]
---

# 状況
Webアプリケーションの開発環境でコンテナを使っている場合、MySQLなどのデータベースもコンテナで起動し、Docker Composeで管理することが多いと思う。

# 問題
テーブルの作成やシードデータの追加といったセットアップ手順は、例えばRailsであれば`db:migrate`や`db:seed`のような便利コマンドによって行われるが、そうした追加のセットアップ手順は可能な限り省略したい。

# 解決
[公式のMySQLコンテナ](https://hub.docker.com/_/mysql)はコンテナの初回起動時に任意のSQLを実行する仕組みがあるため、これを使ってコンテナの起動時に必要なセットアップをすべて終わらせることができる。

以下のようなディレクトリを例にとる。

```
database
├── Dockerfile
├── docker-entrypoint-initdb.d
│   ├── 1_schema.sql
│   └── 2_seed.sql
├── mysqld.cnf
└── seed
    ├── statuses.csv
    └── tasks.csv
```

`Dockerfile`はこうなっている。

```docker
FROM mysql:8
ADD mysqld.cnf /etc/mysql/conf.d/
ADD docker-entrypoint-initdb.d /docker-entrypoint-initdb.d/
ADD seed /seed/
```

* `/etc/mysql/conf.d/`以下に設定ファイルを配置するとincludeされるようになっている。
* `/docker-entrypoint-initdb.d/`ディレクトリ以下に配置した`*.sql`や`*.sh`といったファイルは初回起動時に実行される。
* この例では、`1_schema.sql`でテーブルが作成され、`2_seed.sql`でシードデータが作成されるようになっている。番号をprefixにつけることで実行順を制御している。

シードデータの作成は以下のように行っている。

```sql
LOAD DATA INFILE '/seed/statuses.csv' INTO TABLE statuses FIELDS TERMINATED BY ',' ENCLOSED BY '"';
LOAD DATA INFILE '/seed/tasks.csv' INTO TABLE tasks FIELDS TERMINATED BY ',' ENCLOSED BY '"';
```

ちなみにシードデータはこんな感じ。ヘッダーはつけられなさそうだった。

```
1,TODO,1
2,DOING,2
3,DONE,3

```

`LOAD DATA INFILE`を使ってコンテナ内のCSVファイルからデータを作成しているんだけど、これを行うには設定を追加する必要がある。そのため、以下のような`mysqld.cnf`を`/etc/mysql/conf.d/`以下に配置している。

```
[mysqld]
secure-file-priv = ""
```

以上のようなカスタムイメージを作ることで初回起動時に必要なセットアップがすべて完了した状態で起動できるようになる。
