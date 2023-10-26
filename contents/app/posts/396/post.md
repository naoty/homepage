---
title: PrestoをDockerで試してみる
description: Prestoを学ぶ必要が出てきたので、気軽に試せる環境をDockerで作ってみた。
time: 2020-01-25 17:27
tags: ["presto", "docker"]
---

Prestoを学ぶ必要が出てきたので、気軽に試せる環境をDockerで作ってみた。

[prestosql/presto](https://hub.docker.com/r/prestosql/presto)というDockerイメージを使う。データソースも同じくDockerコンテナとして起動してDocker Composeで接続させる。

# 設定

```yaml
# docker-compose.yml
version: "3.7"
services:
  presto:
    image: prestosql/presto:latest
    ports:
      - 8080:8080
    volumes:
      - ./config/presto:/etc/presto
    depends_on:
      - mysql
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - ./config/mysql/conf.d:/etc/mysql/conf.d
      - ./config/mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
      - ./config/mysql/seed:/seed
```

```properties
# /etc/presto/catalog/mysql.properties
connector.name=mysql
connection-url=jdbc:mysql://mysql:3306
connection-user=root
connection-password=password
```

* Prestoコンテナは`/etc/presto`にある設定ファイルを使うので、ローカルからマウントしておく。ただし、すべての設定ファイルが必要なので、コンテナ内にあるデフォルトの設定ファイルもコピーしておく。
* [#368](/368/)で書いた、MySQLコンテナの起動時にスキーマやシードデータを初期化するテクニックを使っている。
* MySQLの接続情報はカタログの設定ファイルで指定する。

# 試してみる

```
% docker-compose up -d
% docker-compose exec presto presto
presto> SELECT * FROM mysql.hello_presto.pokedex;
 pokemon_id |   name
------------+-----------
          1 | bulbasour
          2 | ivysaur
          3 | venusaur
(3 rows)

Query 20200125_110251_00001_p3vcs, FINISHED, 1 node
Splits: 17 total, 17 done (100.00%)
0:01 [3 rows, 0B] [4 rows/s, 0B/s]
```

今回はMySQLコネクタを試してみたけど、カタログファイルを追加することで他のデータソースにも対応できる。
