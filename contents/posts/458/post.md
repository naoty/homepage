---
title: Cassandraへのクエリの注意点
time: 2021-11-29 18:11
tags: ["cassandra"]
---

Cassandraでテーブルを設計する際、どのようなクエリが実行されるのか想定する必要がある。というのも、Cassandraではテーブルへのクエリに多くの制約があるため、これを知らずにテーブルを設計すると期待していたクエリが実行できない事態になってしまう。

そこで、クエリにどのような制約があるかまとめることにした。例に使うテーブルは以下のようなスキーマで作成した。

```sql
create table access_logs (
  date int,
  time timestamp,
  path text,
  method text,
  user_id bigint,
  primary key ((date), time, path, method)
) with clustering order by (time desc, path asc, method asc);
```

他にもあるかもしれないし、バージョンによって変わりうるが、v3.11.10で検証したところ以下のような制約が見つかった。

* パーティションキーは必須
* クラスタリングキーは前方のカラムを省略できない
* プライマリーキーに含まれていないカラムを指定できない
* ORは使えない
* NOTは使えない
* 不等号は最後に指定するカラムにしか使えない
* OFFSETは使えない

# パーティションキーは必須

```sql
--- NG
select
  *
from
  access_logs
where
  time = '2021-01-01 00:00:00'
;

--- OK
select
  *
from
  access_logs
where
  date = 20210101
  and time = '2021-01-01 00:00:00'
;
```

データを返すノードを決定するためにパーティションキーをすべて指定する必要がある。

# クラスタリングキーは前方のカラムを省略できない

```sql
--- NG
select
  *
from
  access_logs
where
  date = 20210101
  and path = '/'
;

--- OK
select
  *
from
  access_logs
where
  date = 20210101
  and time = '2021-01-01 00:00:00'
  and path = '/'
;
```

あるクラスタリングキーよりも前に定義されているクラスタリングキーがあれば、それも指定する必要がある。

# プライマリーキーに含まれていないカラムを指定できない

```sql
--- NG
select
  *
from
  access_logs
where
  date = 20210101
  and time = '2021-01-01 00:00:00'
  and path = '/'
  and method = 'GET'
  and user_id = 1
;

--- OK
select
  *
from
  access_logs
where
  date = 20210101
  and time = '2021-01-01 00:00:00'
  and path = '/'
  and method = 'GET'
;
```

# ORは使えない

```sql
--- NG
select
  *
from
  access_logs
where
  date = 20210101
  and (time = '2021-01-01 00:00:00' or time = '2021-01-02 00:00:00')
;

--- OK
select
  *
from
  access_logs
where
  date = 20210101
  and time in ('2021-01-01 00:00:00', '2021-01-02 00:00:00')
;
```

# NOTは使えない

```sql
--- NG
select
  *
from
  access_logs
where
  date = 20210101
  and time <> '2021-01-01 00:00:00'
;

--- OK
select
  *
from
  access_logs
where
  date = 20210101
  and time > '2021-01-01 00:00:00'
;
```

Cassandraがシーケンシャルリードのために設計されており、ランダムリードを生じさせる`OR`や`NOT`はサポートされていない。

# 不等号は最後に指定するカラムにしか使えない

```sql
--- NG
select
  *
from
  access_logs
where
  date = 20210101
  and time >= '2021-01-01 00:00:00'
  and path = '/'
;

--- OK
select
  *
from
  access_logs
where
  date = 20210101
  and time >= '2021-01-01 00:00:00'
;
```

# OFFSETは使えない

```sql
--- NG
select
  *
from
  access_logs
where
  date = 20210101
limit
  1
offset
  1
;

--- OK
select
  *
from
  access_logs
where
  date = 20210101
limit
  1
;
```

`LIMIT`は使えるものの`OFFSET`が使えないため、SQLのようにページネーションを実装できない。ページネーションの実装については[以前の記事](/456/)に書いた。

# ALLOW FILTERING
これらの制約はエラーメッセージにもあるとおり`ALLOW FILTERING`で回避することができるが、パフォーマンスに重大な影響をあたえる可能性があるため推奨されていない。詳細については[以前の記事](/444/)にも書いている。
