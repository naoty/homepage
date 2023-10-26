---
title: ALLOW FILTERING
time: 2021-05-23 16:31
tags: ["cassandra"]
---

こんなテーブルがあるとする。

```sql
CREATE TABLE store.shopping_cart (
    userid text PRIMARY KEY,
    item_count int,
    last_update_timestamp timestamp
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

適当にSELECT文を実行するとエラーになる。

```
cassandra@cql> SELECT * FROM store.shopping_cart WHERE item_count > 0;
InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
```

言われた通り、`ALLOW FILTERING`をつけるとエラーがでなくなる。

```
cassandra@cqlsh> select * from shopping_cart where item_count > 0 ALLOW FILTERING;

 userid | item_count | last_update_timestamp
--------+------------+-----------------------
   4567 |         20 |                  null

(1 rows)
```

こういったエラーが出るクエリはテーブルからすべてのレコードを取得してからフィルタリングをおこなうため、場合によっては非常に効率が悪くなる。例えば、100万件中2件だけの結果になる場合でも100万件を取得することになってしまう。逆に、100万件中99万件を返すことになるならそこまで非効率ではない。そういう場合は`ALLOW FILTERING`をつけて実行すればいい。

すべてのレコードを取得しないようにするには、partitionを特定できるように条件を指定する必要がある。以下のようにPRIMARY KEYである`userid`カラムに対する一致条件を指定した場合、partitionが特定されるためエラーメッセージが出ない。

```
cassandra@cqlsh> select * from shopping_cart where userid = '4567';

 userid | item_count | last_update_timestamp
--------+------------+-----------------------
   4567 |         20 |                  null

(1 rows)
````

# 参考
* [ALLOW FILTERING explained](https://www.datastax.com/blog/allow-filtering-explained)
