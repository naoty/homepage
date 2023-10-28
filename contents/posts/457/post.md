---
title: sstabledump
time: 2021-11-26 09:13
tags: ["cassandra"]
---

Cassandraではデータがsstableと呼ばれるファイルにデータを格納している。sstabledumpというツールを使ってこのファイルの中身を見ることでどのようにデータが格納されているか確認してみた。

まず、例となるテーブルを作ってデータを追加する。

```
cqlsh:hello> create table access_logs (
         ...   date int,
         ...   time timestamp,
         ...   path text,
         ...   method text,
         ...   user_id bigint,
         ...   primary key ((date), time)
         ... ) with clustering order by (time desc);
cqlsh:hello> insert into access_logs (date, time, path, method, user_id) values (20210101, '2021-01-01 00:00:00', '/', 'GET', 1);
cqlsh:hello> insert into access_logs (date, time, path, method, user_id) values (20210101, '2021-01-01 01:00:00', '/', 'GET', 1);
cqlsh:hello> insert into access_logs (date, time, path, method, user_id) values (20210102, '2021-01-02 00:00:00', '/', 'GET', 1);
```

書き込まれたデータはすぐにsstableに格納されるわけではなく、memtableと呼ばれるメモリ上の領域に書き込まれ、その後flushによってsstableに書き込まれる。そこで、`nodetool flush`を使って手動でflushしてからsstableの中身を確認する。

```
$ nodetool flush -- hello access_logs
$ sstabledump data/data/hello/access_logs-725f76b04e4d11ec9a87738bc243f3cf/nb-1-big-Data.db
[
  {
    "partition" : {
      "key" : [ "20210101" ],
      "position" : 0
    },
    "rows" : [
      {
        "type" : "row",
        "position" : 18,
        "clustering" : [ "2021-01-01 01:00:00.000Z" ],
        "liveness_info" : { "tstamp" : "2021-11-26T00:12:04.653070Z" },
        "cells" : [
          { "name" : "method", "value" : "GET" },
          { "name" : "path", "value" : "/" },
          { "name" : "user_id", "value" : 1 }
        ]
      },
      {
        "type" : "row",
        "position" : 51,
        "clustering" : [ "2021-01-01 00:00:00.000Z" ],
        "liveness_info" : { "tstamp" : "2021-11-26T00:11:57.459111Z" },
        "cells" : [
          { "name" : "method", "value" : "GET" },
          { "name" : "path", "value" : "/" },
          { "name" : "user_id", "value" : 1 }
        ]
      }
    ]
  },
  {
    "partition" : {
      "key" : [ "20210102" ],
      "position" : 82
    },
    "rows" : [
      {
        "type" : "row",
        "position" : 100,
        "clustering" : [ "2021-01-02 00:00:00.000Z" ],
        "liveness_info" : { "tstamp" : "2021-11-26T00:12:12.925794Z" },
        "cells" : [
          { "name" : "method", "value" : "GET" },
          { "name" : "path", "value" : "/" },
          { "name" : "user_id", "value" : 1 }
        ]
      }
    ]
  }
]
```

sstabledumpの結果からいくつかのことが分かる。

* パーティション毎に行がまとめられている。
* パーティション内の各行はクラスタリングキーでソートされている（`clustering order`で指定したとおり`time`の降順になっている）。
* プライマリーキー以外の値は各行のセルと呼ばれる領域に格納されている。

このことからも以下のようなことが自然と理解できる。

* プライマリーキー以外のカラムを`where`に指定するとパーティションをまたいで取得することになる
* クラスタリングキーのソート順と異なる`order by`が非効率

sstabledumpを通じてまたひとつCassandraへの理解が深まった。
