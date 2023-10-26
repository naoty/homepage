---
title: 手を動かしながらロックを学ぶ 3
time: 2021-06-10 08:52
tags: ["mysql"]
---

* [Part 1](/445/): `select`による特定の一行に対するロック
* [Part 2](/446/): `select`による複数行に対するロック
* Part 3: `insert`, `update`, `delete`によるロック

今回は`insert`等の操作がどのようなロックをとるのか調べてみる。前回と同様にworldデータベースを使い、同じ下準備を済ませる。

# insert
外部キー制約の有無で結果が変わったため、先に外部キー制約がない場合を見る。

外部キー制約がない`country`テーブルに`insert`してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> insert into country (`Code`, `Name`, `Region`, `LocalName`, `GovernmentForm`, `Code2`) values ('AFZ', 'dummy', 'dummy', 'dummy', 'dummy', 'AZ')
Query OK, 1 row affected
Time: 0.002s
```

```
------------
TRANSACTIONS
------------
Trx id counter 2664
Purge done for trx's n:o < 2662 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421394077937904, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077936192, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077935336, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 2663, ACTIVE 3 sec
1 lock struct(s), heap size 1136, 0 row lock(s), undo log entries 1
MySQL thread id 47, OS thread handle 139918963160832, query id 355 localhost root
TABLE LOCK table `world`.`country` trx id 2663 lock mode IX
```

`RECORD LOCKS`から始まる行が出力されなかった。

次に`country`テーブルへの外部キー制約をもつ`city`テーブルへの`insert`を試してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> insert into city (`Name`, `CountryCode`, `District`, `Population`) values ('dummy', 'AFG', 'dummy', 1)
Query OK, 1 row affected
Time: 0.013s
```

```
------------
TRANSACTIONS
------------
Trx id counter 2059
Purge done for trx's n:o < 2054 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421226401721752, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421226401720896, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421226401720040, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 2058, ACTIVE 20 sec
3 lock struct(s), heap size 1136, 1 row lock(s), undo log entries 1
MySQL thread id 11, OS thread handle 139751396103936, query id 40 localhost root
TABLE LOCK table `world`.`city` trx id 2058 lock mode IX
TABLE LOCK table `world`.`country` trx id 2058 lock mode IS
RECORD LOCKS space id 3 page no 5 n bits 120 index PRIMARY of table `world`.`country` trx id 2058 lock mode S locks rec but not gap
Record lock, heap no 3 PHYSICAL RECORD: n_fields 17; compact format; info bits 0
 0: len 3; hex 414647; asc AFG;;
 1: len 6; hex 000000000647; asc      G;;
 2: len 7; hex 820000008f011c; asc        ;;
 3: len 30; hex 41666768616e697374616e20202020202020202020202020202020202020; asc Afghanistan                   ; (total 52 bytes);
 4: len 1; hex 01; asc  ;;
 5: len 26; hex 536f75746865726e20616e642043656e7472616c204173696120; asc Southern and Central Asia ;;
 6: len 5; hex 8009f33a00; asc    : ;;
 7: len 2; hex 877f; asc   ;;
 8: len 4; hex 815aae00; asc  Z  ;;
 9: len 2; hex ad09; asc   ;;
 10: len 5; hex 8000175800; asc    X ;;
 11: SQL NULL;
 12: len 30; hex 416667616e697374616e2f416671616e657374616e202020202020202020; asc Afganistan/Afqanestan         ; (total 45 bytes);
 13: len 30; hex 49736c616d696320456d6972617465202020202020202020202020202020; asc Islamic Emirate               ; (total 45 bytes);
 14: len 30; hex 4d6f68616d6d6164204f6d61722020202020202020202020202020202020; asc Mohammad Omar                 ; (total 60 bytes);
 15: len 4; hex 80000001; asc     ;;
 16: len 2; hex 4146; asc AF;;
```

> RECORD LOCKS space id 3 page no 5 n bits 120 index PRIMARY of table `world`.`country` trx id 2058 lock mode S locks rec but not gap

`country`テーブルのクラスタインデックスにおいて外部キーである`AFG`にマッチするレコードに対してレコードロックを取得している。ただし、排他ロックではなく共有ロックとなっている。

そこで、別トランザクションで`country`テーブルに対して排他ロックを取得してみようとしたが、やっぱりできなかった。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> select * from country for update
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

# update
まずはプライマリーキーで特定の列のみ`update`してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.000s
MySQL (none)@(none):world> update city set `Population` = `Population` + 1000000 where `ID` = 1;
Query OK, 1 row affected
Time: 0.001s
```

このときのロックを確認する。

```
------------
TRANSACTIONS
------------
Trx id counter 2666
Purge done for trx's n:o < 2662 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421394077937904, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077936192, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077935336, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 2665, ACTIVE 16 sec
2 lock struct(s), heap size 1136, 1 row lock(s), undo log entries 1
MySQL thread id 47, OS thread handle 139918963160832, query id 363 localhost root
TABLE LOCK table `world`.`city` trx id 2665 lock mode IX
RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 2665 lock_mode
X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000001; asc     ;;
 1: len 6; hex 000000000a69; asc      i;;
 2: len 7; hex 02000001250151; asc     % Q;;
 3: len 30; hex 4b6162756c20202020202020202020202020202020202020202020202020; asc Kabul
       ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4b61626f6c202020202020202020202020202020; asc Kabol               ;;
 6: len 4; hex 802a6b60; asc  *k`;;
```

プライマリーキーで条件を指定しているので、クラスタインデックスに対してレコードロックを取得している。これは[前回](/446/)で`select ... for update`でプライマリーキーを条件とした場合と同じということになる。

次にセカンダリインデックスに対して条件を指定して複数行を`update`してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> update city set `Population` = `Population` + 100000 where `CountryCode` = 'AFG'
Query OK, 4 rows affected
Time: 0.001s
```

ロックを確認する。

```
------------
TRANSACTIONS
------------
Trx id counter 3085
Purge done for trx's n:o < 3084 undo n:o < 0 state: running but idle
History list length 1
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421984916573592, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421984916572736, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421984916571880, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 3084, ACTIVE 7 sec
4 lock struct(s), heap size 1136, 9 row lock(s), undo log entries 4
MySQL thread id 10, OS thread handle 140509924382464, query id 44 localhost root
TABLE LOCK table `world`.`city` trx id 3084 lock mode IX
RECORD LOCKS space id 2 page no 14 n bits 1272 index CountryCode of table `world`.`city` trx id 3084 lock_mode X
Record lock, heap no 3 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 3; hex 414647; asc AFG;;
 1: len 4; hex 80000001; asc     ;;

Record lock, heap no 4 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 3; hex 414647; asc AFG;;
 1: len 4; hex 80000002; asc     ;;

Record lock, heap no 5 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 3; hex 414647; asc AFG;;
 1: len 4; hex 80000003; asc     ;;

Record lock, heap no 6 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 3; hex 414647; asc AFG;;
 1: len 4; hex 80000004; asc     ;;

RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 3084 lock_mode X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000001; asc     ;;
 1: len 6; hex 000000000c0c; asc       ;;
 2: len 7; hex 010000011c0151; asc       Q;;
 3: len 30; hex 4b6162756c20202020202020202020202020202020202020202020202020; asc Kabul                         ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4b61626f6c202020202020202020202020202020; asc Kabol               ;;
 6: len 4; hex 801cafc0; asc     ;;

Record lock, heap no 3 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000002; asc     ;;
 1: len 6; hex 000000000c0c; asc       ;;
 2: len 7; hex 010000011c0174; asc       t;;
 3: len 30; hex 51616e646168617220202020202020202020202020202020202020202020; asc Qandahar                      ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 51616e6461686172202020202020202020202020; asc Qandahar            ;;
 6: len 4; hex 8005265c; asc   &\;;

Record lock, heap no 4 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000003; asc     ;;
 1: len 6; hex 000000000c0c; asc       ;;
 2: len 7; hex 010000011c0197; asc        ;;
 3: len 30; hex 486572617420202020202020202020202020202020202020202020202020; asc Herat                         ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4865726174202020202020202020202020202020; asc Herat               ;;
 6: len 4; hex 80046050; asc   `P;;

Record lock, heap no 5 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 000000000c0c; asc       ;;
 2: len 7; hex 010000011c01ba; asc        ;;
 3: len 30; hex 4d617a61722d652d53686172696620202020202020202020202020202020; asc Mazar-e-Sharif                ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 42616c6b68202020202020202020202020202020; asc Balkh               ;;
 6: len 4; hex 800379d8; asc   y ;;

RECORD LOCKS space id 2 page no 14 n bits 1272 index CountryCode of table `world`.`city` trx id 3084 lock_mode X locks gap before rec
Record lock, heap no 7 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 3; hex 41474f; asc AGO;;
 1: len 4; hex 80000038; asc    8;;
```

これも同様に`select ... for update`でセカンダリインデックスを指定した場合のロック範囲と一致する。

# delete
`update`と同じ結果になったので割愛する。

# まとめ
* `insert`は外部キー制約がある場合、外部テーブルに対して共有ロックでのレコードロックを取得する。
* `update`と`delete`は`select ... for update`と同じ。
