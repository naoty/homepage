---
title: SQLで順番を更新する
time: 2019-04-26T17:08:00+0900
tags: ["db"]
---

# 状況
順番をもつテーブルでレコードの順番を更新したい。例えば、タスク管理アプリケーションであるタスクの順番を上げたり下げたりしたい場合を想定する。

# 問題
単純にレコードの順番を更新したい値に更新するだけでは不十分で、前後のタスクの順番も繰り上げたり繰り下げる必要がある。そのため、多数のレコードを更新する可能性がある。

# 解決
タスク管理アプリケーションの`tasks`テーブルを例にとって考える。タスクの順番は`position`カラムで表すことにする。

順番を上げる場合と下げる場合でSQLを分ける。まず、順番を上げる場合、例えば、4番目のタスクを2番目に上げる場合はこう書く。

```sql
UPDATE
  tasks
SET
  position = (CASE
              WHEN position = 4 THEN 2
              WHEN position >= 2 AND position < 4 THEN position + 1
              ELSE position
              END)
WHERE
  position BETWEEN 2 AND 4
;
```

次に、順番を下げる場合、例えば、2番目のタスクを4番目に下げる場合はこう書く。

```sql
UPDATE
  tasks
SET
  position = (CASE
              WHEN position = 2 THEN 4
              WHEN position > 2 AND position <= 4 THEN position - 1
              ELSE position
              END)
WHERE
  position BETWEEN 2 AND 4
;
```

SQLのポイントは以下の通り。

* `CASE`式を使って条件付きの更新処理を一括で行うようにしている。`CASE`式を使わずに以下のように2つに分けて書いてしまうと、最初のSQLで更新されたレコードが次のSQLの条件に含まれてしまい誤った値（この場合は3）に更新されてしまう。

```sql
UPDATE tasks SET position = 2 WHERE position = 4;
UPDATE tasks SET position = position + 1 WHERE position >= 2 AND position < 4
```

* `WHERE`句で更新の対象となるレコードを最小限に絞り込んでいる。`UPDATE`文は条件を指定しないとすべてのレコードにマッチしてしまうため、更新対象となる範囲を指定している。

# 参考
* [達人に学ぶSQL徹底指南書 第2版](https://www.shoeisha.co.jp/book/detail/9784798157825)
