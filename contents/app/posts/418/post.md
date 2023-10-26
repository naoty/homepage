---
title: あるカラムをもつテーブルを探すには
time: 2020-06-08 23:03
tags: ["db"]
---

とある調査であるカラムを含むテーブルをリストアップしなくてはいけなくて、途中までschema.rbなどを眺めていたんだけど、途中から効率的なやり方があったのでメモをしておく。

以下、`email`または`address`というカラムをもつテーブルをリストアップしたいとする。

# MySQL

```sql
SELECT
  *
FROM
  information_schemas.COLUMNS
WHERE
  COLUMN_NAME IN ('email', 'address')
;
```

`information_schemas`データベースにメタデータがある。

# BigQuery

```sql
SELECT
  *
FROM
  my_project.INFORMATION_SCHEMA.COLUMNS
WHERE
  column_name IN ('email', 'address')
;
```

beta版だけどBigQueryにもメタデータを含むデータセットがある。

# Hive

おそらくこれがブログに残したかった最大の理由。

```sql
SELECT
  SDS.SD_ID,
  TBLS.TBL_NAME,
  COLUMNS_V2.`COLUMN_NAME`
FROM
  SDS
  JOIN TBLS USING (SD_ID)
  JOIN COLUMNS_V2 USING (CD_ID)
WHERE
  COLUMNS_V2.`COLUMN_NAME` IN ('email', 'address')
;
```

Hive metastoreへのクエリでHiveテーブルのメタデータを取得できる。`COLUMNS_V2`テーブルにはどのテーブルのカラムかという情報が（なぜか）ない。

いろいろ調べた結果、`SDS`という謎テーブルにjoinすることでテーブル名も取得できることがわかった。

# Cassandra

```sql
SELECT
  *
FROM
  system_schema.columns
WHERE
  keyspace_name = 'my_keyspace'
  AND column_name IN 'email'
ALLOW FILTERING
;
```

`system_schema.columns`にメタデータがある。`ALLOW FILTERING`をつけないと以下のようなエラーが出るので注意。

```
Query 1 ERROR: PRIMARY KEY column "column_name" cannot be restricted as preceding column "table_name" is not restricted
```

