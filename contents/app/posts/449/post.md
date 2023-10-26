---
title: CQL入門
time: 2021-06-28 22:17
tags: ["cassandra"]
---

Cassandraを本格的に扱う機会ができたので、CQL実際に試しながら覚えていきたい。CassandraにはDocker公式のイメージがあるため、これを利用する。

```
% docker run --name hello-cassandra cassandra
```

`cqlsh`でCQLを実際に試していく。

```
% docker exec --interactive --tty hello-cassandra cqlsh
Connected to Test Cluster at 127.0.0.1:9042.
[cqlsh 5.0.1 | Cassandra 3.11.10 | CQL spec 3.4.4 | Native protocol v4]
Use HELP for help.
cqlsh>
```

# キースペースの作成
Cassandraはキースペースと呼ばれるものの中にテーブルが存在し、1つのアプリケーションにつき1つのキースペースを用意するとのことなので、まずはキースペースを作る。

```
cqlsh> create keyspace hello with replication = {'class' : 'SimpleStrategy', 'replication_factor' : 1};
```

キースペースを作成する際にレプリケーションストラテジーとレプリケーション係数を指定する必要がある。今回はテストなので、`SimpleStrategy`を選択しレプリケーション係数も1にする。

キースペースの一覧は`desc keyspaces`で確認できる。

```
cqlsh> desc keyspaces;

system_schema  system_auth  system  system_distributed  system_traces  hello
```

以降の操作で扱うキースペースを選択するにはSQLと同様に`use`を使う。

```
cqlsh> use hello;
cqlsh:hello>
```

# テーブルの作成
作成したキースペース内にテーブルを作成する。これもSQLと同様に`create table`を使う。

```
cqlsh:hello> create table users (
         ...   user_id bigint primary key,
         ...   name varchar,
         ...   birthday date
         ... );
```

Cassandraがサポートするデータ型は[ここ](https://docs.datastax.com/ja/dse/5.1/cql/cql/cql_reference/refDataTypes.html)を参考にするといい。

テーブルのリストはキースペースと同様に`desc tables`で見れる。

```
cqlsh:hello> desc tables;

users
```

各テーブルのスキーマはSQLと同様に`desc <table名>`で見れる。

```
cqlsh:hello> desc users;

CREATE TABLE hello.users (
    user_id bigint PRIMARY KEY,
    birthday date,
    name text
) WITH bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99PERCENTILE';
```

# データの挿入・更新
これもSQL同様に`insert into <table名> (<カラム1>, ...) values (<値1>, ...)`でデータを挿入できる。

```
cqlsh:hello> insert into users (user_id, birthday, name)
         ... values (1, '2021-01-01', 'naoty');
```

SQLと違う部分は複数行を一度に`insert`できない。

```
cqlsh:hello> insert into users (user_id, birthday, name)
         ... values (1, '2021-01-01', 'naoty'),
                    (2, '2021-02-01', 'naoty2');
SyntaxException: line 2:33 mismatched input ',' expecting EOF (... (1, '2021-01-01', 'naoty')[,]...)
```

さらに、primary keyが同じレコードを`insert`すると更新処理になる。upsertと呼ばれる処理になっている。

```
cqlsh:hello> insert into users (user_id, birthday, name)
         ... values (1, '2021-01-01', 'naoty2');
cqlsh:hello> select * from users where user_id = 1;

 user_id | birthday   | name
---------+------------+--------
       1 | 2021-01-01 | naoty2

(1 rows)
```

# クエリ実行

```
cqlsh:hello> select * from users;

 user_id | birthday   | name
---------+------------+--------
       1 | 2021-01-01 | naoty2

(1 rows)
```

条件を指定する場合は`where`で指定できる。ただし、[以前の記事](/444/)でも書いた通り、プライマリーキー以外のカラムを`where`で指定することは制限されている。

```
cqlsh:hello> select * from users where user_id = 1;

 user_id | birthday   | name
---------+------------+--------
       1 | 2021-01-01 | naoty2

(1 rows)
cqlsh:hello> select * from users where name = 'naoty2';
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
```

# データの削除
SQLと同様に`delete from`で削除できる。

```
cqlsh:hello> delete from users where user_id = 1;
cqlsh:hello> select * from users;

 user_id | birthday | name
---------+----------+------

(0 rows)
```

# カラムの追加
SQLと同様に`alter table <table名> add <カラム名> <データ型>`でできる。

```
cqlsh:hello> alter table users add lastname text;
cqlsh:hello> desc users;

CREATE TABLE hello.users (
    user_id bigint PRIMARY KEY,
    birthday date,
    lastname text,
    name text
) WITH bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99PERCENTILE';
```

# カラムのリネーム
`alter table <table名> rename <古いカラム名> to <新しいカラム名>`でできる。

```
cqlsh:hello> alter table users rename name to firstname;
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot rename non PRIMARY KEY part name"
```

ただし、リネームができるのはprimary keyのclustering columnだけのようだ。

# カラムの削除
SQLと同様に`alter table <table名> drop <カラム名>`でできる。

```
cqlsh:hello> alter table users drop lastname;
cqlsh:hello> desc users;

CREATE TABLE hello.users (
    user_id bigint PRIMARY KEY,
    birthday date,
    name text
) WITH bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99PERCENTILE';
```

# 参考
* https://docs.datastax.com/ja/dse/5.1/cql/index.html
