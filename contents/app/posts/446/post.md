---
title: 手を動かしながらロックを学ぶ 2
time: 2021-06-09 22:19
tags: ["mysql"]
---

* [Part 1](/445/): `select`による特定の一行に対するロック
* Part 2: `select`による複数行に対するロック
* [Part 3](/447/): `insert`, `update`, `delete`によるロック

前回に続いて、今度は`select ... for update`で複数件取得した場合のロックについて試してみる。

前回同様にworldデータベースの`city`テーブルを使う。

```sql
MySQL (none)@(none):world> show create table city \G
***************************[ 1. row ]***************************
Table        | city
Create Table | CREATE TABLE `city` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` char(35) NOT NULL DEFAULT '',
  `CountryCode` char(3) NOT NULL DEFAULT '',
  `District` char(20) NOT NULL DEFAULT '',
  `Population` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `CountryCode` (`CountryCode`),
  CONSTRAINT `city_ibfk_1` FOREIGN KEY (`CountryCode`) REFERENCES `country` (`Code`)
) ENGINE=InnoDB AUTO_INCREMENT=4080 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

1 row in set
Time: 0.017s
```

# 下準備
ロック待ちの確認にかかる時間を減らすため、timeoutを1秒にしておく。

```sql
MySQL (none)@(none):world> set innodb_lock_wait_timeout = 1;
Query OK, 0 rows affected
Time: 0.001s
```

あとで`show engine innodb status`でトランザクションの状態を確認するため、出力するようにする。

```sql
MySQL (none)@(none):world> set global innodb_status_output_locks = on
Query OK, 0 rows affected
Time: 0.002s
```

# クラスタインデックスによるロック
プライマリーキーを条件に指定して`select ... for update`してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.000s
MySQL (none)@(none):world> select * from city where `ID` = 1 for update
+----+-------+-------------+----------+------------+
| ID | Name  | CountryCode | District | Population |
+----+-------+-------------+----------+------------+
| 1  | Kabul | AFG         | Kabol    | 1780000    |
+----+-------+-------------+----------+------------+

1 row in set
Time: 0.011s
```

どのようなロックがかかっているか確認するため`show engine innodb status`を実行して`TRANSACTIONS`を見る。

```
------------
TRANSACTIONS
------------
Trx id counter 2668
Purge done for trx's n:o < 2667 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421394077937904, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077936192, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077935336, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 2667, ACTIVE 4 sec
2 lock struct(s), heap size 1136, 1 row lock(s)
MySQL thread id 47, OS thread handle 139918963160832, query id 369 localhost root
TABLE LOCK table `world`.`city` trx id 2667 lock mode IX
RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 2667 lock_mode X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000001; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a0110; asc        ;;
 3: len 30; hex 4b6162756c20202020202020202020202020202020202020202020202020; asc Kabul
       ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4b61626f6c202020202020202020202020202020; asc Kabol               ;;
 6: len 4; hex 801b2920; asc   ) ;;
```

> RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 2667 lock_mode X locks rec but not gap

`RECORD LOCKS`から始まる行に着目すると、クラスタインデックスに対するレコードロックを取得していることがわかる。レコードロックはそのまま、そのレコード自身に対するロックを指している。

試しに取得したレコードを`update`してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> update city set `Population` = `Population` + 1000000 where `ID` = 1;
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

次に、条件にマッチするレコードがなかったときのロックの範囲を確認する。

```sql
MySQL root@localhost:world> begin
Query OK, 0 rows affected
Time: 0.003s
MySQL root@localhost:world> select * from city where `ID` = 10000 for update
+----+------+-------------+----------+------------+
| ID | Name | CountryCode | District | Population |
+----+------+-------------+----------+------------+
+----+------+-------------+----------+------------+
0 rows in set
Time: 0.011s
```

```
------------
TRANSACTIONS
------------
Trx id counter 7005
Purge done for trx's n:o < 7001 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421497825593776, not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 421497825592968, not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 7004, ACTIVE 162 sec
2 lock struct(s), heap size 1128, 1 row lock(s)
MySQL thread id 91, OS thread handle 140022380754688, query id 647 172.21.0.1 root starting
show engine innodb status
TABLE LOCK table `world`.`city` trx id 7004 lock mode IX
RECORD LOCKS space id 2 page no 35 n bits 232 index PRIMARY of table `world`.`city` trx id 7004 lock_mode X
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info bits 0
 0: len 8; hex 73757072656d756d; asc supremum;;
```

> RECORD LOCKS space id 2 page no 35 n bits 232 index PRIMARY of table `world`.`city` trx id 7004 lock_mode X

今度はレコードロックではなくネクストキーロックを取得している。ネクストキーロックとは、そのレコード自身とそのレコードと一つ前のレコードの間のギャップに対するロックを指している。

この場合は`suprenum`と呼ばれる、上限値を表す内部的なレコードに対するネクストキーロックが取得されている。よって、`suprenum`とその前のレコード、すなわち`id`が最大のレコードとの間のギャップに対してロックが取得されたということになる。

この状態で別セッションから新たな`city`を`insert`してみる。

```sql
MySQL root@localhost:world> begin
Query OK, 0 rows affected
Time: 0.003s
MySQL root@localhost:world> insert into city (`Name`, `CountryCode`, `District`, `Population`) values ('dummy', 'DUM', 'dummy', 1)
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

`id`が最大のレコードと`suprenum`との間のギャップロックが取得されているため、`insert`がロック解除待ちになってしまった。

条件をいろいろ変えてみると、インデックスのどの範囲に含まれるかによってロックの種類や範囲は変わることがわかった。指定した条件を含むレコードの区間のギャップロックが取得されると考えてよさそうだ。

# セカンダリインデックスによるロック
セカンダリインデックス`CountryCode`を条件に指定して`select ... for update`してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> select * from city where `CountryCode` = 'AFG' for update
+----+----------------+-------------+----------+------------+
| ID | Name           | CountryCode | District | Population |
+----+----------------+-------------+----------+------------+
| 1  | Kabul          | AFG         | Kabol    | 1780000    |
| 2  | Qandahar       | AFG         | Qandahar | 237500     |
| 3  | Herat          | AFG         | Herat    | 186800     |
| 4  | Mazar-e-Sharif | AFG         | Balkh    | 127800     |
+----+----------------+-------------+----------+------------+

4 rows in set
Time: 0.013s
```

先程と同様にロックを確認する。

```
------------
TRANSACTIONS
------------
--- (snip) ---
---TRANSACTION 2650, ACTIVE 3 sec
4 lock struct(s), heap size 1136, 9 row lock(s)
MySQL thread id 36, OS thread handle 139918963455744, query id 301 localhost root
TABLE LOCK table `world`.`city` trx id 2650 lock mode IX
RECORD LOCKS space id 2 page no 14 n bits 1272 index CountryCode of table `world`.`city` trx id 2650 lock_mode X
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

RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 2650 lock_mode X locks rec but not gap
Record lock, heap no 2 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000001; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a0110; asc        ;;
 3: len 30; hex 4b6162756c20202020202020202020202020202020202020202020202020; asc Kabul    ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4b61626f6c202020202020202020202020202020; asc Kabol               ;;
 6: len 4; hex 801b2920; asc   ) ;;

Record lock, heap no 3 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000002; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a011d; asc        ;;
 3: len 30; hex 51616e646168617220202020202020202020202020202020202020202020; asc Qandahar    ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 51616e6461686172202020202020202020202020; asc Qandahar            ;;
 6: len 4; hex 80039fbc; asc     ;;

Record lock, heap no 4 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000003; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a012a; asc       *;;
 3: len 30; hex 486572617420202020202020202020202020202020202020202020202020; asc Herat    ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4865726174202020202020202020202020202020; asc Herat               ;;
 6: len 4; hex 8002d9b0; asc     ;;

Record lock, heap no 5 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a0137; asc       7;;
 3: len 30; hex 4d617a61722d652d53686172696620202020202020202020202020202020; asc Mazar-e-Sharif    ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 42616c6b68202020202020202020202020202020; asc Balkh               ;;
 6: len 4; hex 8001f338; asc    8;;

RECORD LOCKS space id 2 page no 14 n bits 1272 index CountryCode of table `world`.`city` trx id 2650 lock_mode X locks gap before rec
Record lock, heap no 7 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 3; hex 41474f; asc AGO;;
 1: len 4; hex 80000038; asc    8;;
--- (snip) ---
```

`RECORD LOCKS`から始まる行に注目すると、3種類のロックを取得していることがわかる。

> RECORD LOCKS space id 2 page no 14 n bits 1272 index CountryCode of table `world`.`city` trx id 2650 lock_mode X

これは`CountryCode`インデックスレコードに対してネクストキーロックを取得していることを表している。

今回は`AFG`にマッチする`Kabol`, `Qandahar`, `Herat`, `Balkh`を含むレコードと、それらのレコードの前のギャップにロックを取得することになる。また、`Kabol`は最小の値のはずなので、無限に小さい論理的なレコードとの間のギャップがロックされることになる。

試しに別のトランザクションから`AFG`かつ`Kabol`より小さい値を`insert`してみる。

```sql
MySQL (none)@(none):world> insert into city (`Name`, `CountryCode`, `District`, `Population`) values ('aaa', 'AFG', 'aaa', 1000);
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

> RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 2650 lock_mode X locks rec but not gap

これはクラスタインデックスに対してレコードロックを取得していることを表している。

試しに別のトランザクションからクラスタインデックスに含まれる値を`update`してみる。

```sql
MySQL (none)@(none):world> update city set `Population` = `Population` + 1000000 where `ID` = 1;
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

> RECORD LOCKS space id 2 page no 14 n bits 1272 index CountryCode of table `world`.`city` trx id 2650 lock_mode X locks gap before rec

これは`CountryCode`インデックスレコードに対するギャップロックを取得していることを表している。ギャップロックとは、あるレコードとその前のレコードの間のギャップに対するロックを指している。

この行の下の方に以下のように出力されており、`CountryCode`が`AGO`はちょうど`AFG`の次の値になっているため、`AFG`と`AGO`の間のギャップをロックしていることになる。

> 0: len 3; hex 41474f; asc AGO;;

試しに別のトランザクションでこの間に新たな`CountryCode`を`insert`してみる。`CountryCode`には外部キー制約があるため`country`にも`insert`してから`insert`する。

```sql
MySQL (none)@(none):world> insert into country (`Code`, `Name`, `Region`, `LocalName`, `GovernmentForm`, `Code2`) values ('AFZ', 'dummy', 'dummy', 'dummy', 'dummy', 'AZ')
Query OK, 1 row affected
Time: 0.002s
MySQL (none)@(none):world> insert into city (`Name`, `CountryCode`, `District`, `Population`) values ('aaa', 'AFZ', 'aaa', 1000);
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

次に、条件にマッチしなかった場合も確認する。

```sql
MySQL root@localhost:world> begin
Query OK, 0 rows affected
Time: 0.003s
MySQL root@localhost:world> select * from city where `CountryCode` = 'NTY' for update
+----+------+-------------+----------+------------+
| ID | Name | CountryCode | District | Population |
+----+------+-------------+----------+------------+
+----+------+-------------+----------+------------+

0 rows in set
Time: 0.014s
```

```
------------
TRANSACTIONS
------------
Trx id counter 7010
Purge done for trx's n:o < 7001 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421497825593776, not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 421497825592968, not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 7009, ACTIVE 24 sec
2 lock struct(s), heap size 1128, 1 row lock(s)
MySQL thread id 99, OS thread handle 140022381811456, query id 705 172.21.0.1 root starting
show engine innodb status
TABLE LOCK table `world`.`city` trx id 7009 lock mode IX
RECORD LOCKS space id 2 page no 20 n bits 1272 index CountryCode of table `world`.`city` trx id 7009 lock_mode X locks gap before rec
Record lock, heap no 178 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 3; hex 4e5a4c; asc NZL;;
 1: len 4; hex 80000da6; asc     ;;
```

`lock_mode X locks gap before rec`とあるので、ギャップロックが取得されている。この場合、`NTY`という`CountryCode`はなかったので、`NZL`という`CountryCode`の手前のギャップロックが取得されている。

マッチした場合とは異なり、セカンダリインデックスのみロックが取得され、クラスタリングインデックスには影響がなかった。

# インデックスなしでのロック
最後にインデックスを使わない条件を指定して`select ... for update`してみる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> select * from city where `Population` between 1000000 and 1200000 for update
+------+-------------------+-------------+----------------------+------------+
| ID   | Name              | CountryCode | District             | Population |
+------+-------------------+-------------+----------------------+------------+
| 71   | Córdoba           | ARG         | Córdoba              | 1157507    |
| 133  | Perth             | AUS         | West Australia       | 1096829    |
| 216  | Belém             | BRA         | Pará                 | 1186926    |
| 217  | Guarulhos         | BRA         | São Paulo            | 1095874    |
--- (snip) ---
```

同様にしてロックを確認する。

```
------------
TRANSACTIONS
------------
Trx id counter 2671
Purge done for trx's n:o < 2667 undo n:o < 0 state: running but idle
History list length 0
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 421394077937904, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077936192, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 421394077935336, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 2670, ACTIVE 6 sec
25 lock struct(s), heap size 3520, 4103 row lock(s)
MySQL thread id 47, OS thread handle 139918963160832, query id 381 localhost root
TABLE LOCK table `world`.`city` trx id 2670 lock mode IX
RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 2670 lock_mode X
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info bits 0
 0: len 8; hex 73757072656d756d; asc supremum;;

Record lock, heap no 2 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000001; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a0110; asc        ;;
 3: len 30; hex 4b6162756c20202020202020202020202020202020202020202020202020; asc Kabul                         ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4b61626f6c202020202020202020202020202020; asc Kabol               ;;
 6: len 4; hex 801b2920; asc   ) ;;

Record lock, heap no 3 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000002; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a011d; asc        ;;
 3: len 30; hex 51616e646168617220202020202020202020202020202020202020202020; asc Qandahar                      ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 51616e6461686172202020202020202020202020; asc Qandahar            ;;
 6: len 4; hex 80039fbc; asc     ;;

Record lock, heap no 4 PHYSICAL RECORD: n_fields 7; compact format; info bits 0
 0: len 4; hex 80000003; asc     ;;
 1: len 6; hex 00000000063a; asc      :;;
 2: len 7; hex 820000008a012a; asc       *;;
 3: len 30; hex 486572617420202020202020202020202020202020202020202020202020; asc Herat                         ; (total 35 bytes);
 4: len 3; hex 414647; asc AFG;;
 5: len 20; hex 4865726174202020202020202020202020202020; asc Herat               ;;
 6: len 4; hex 8002d9b0; asc     ;;
--- (snip) ---
```

> RECORD LOCKS space id 2 page no 6 n bits 248 index PRIMARY of table `world`.`city` trx id 2670 lock_mode X

とあるので、取得したクラスタインデックスすべてに対してネクストキーロックを取得していることがわかる。

# まとめ
まとめると、こういうことがわかった。

* クラスタインデックスを使った`select ... for update`はマッチした行のレコードロックを取得する。マッチしなかった場合、条件の値を含む区間のギャップロックを取得する。
* セカンダリインデックスを使った`select ... for update`はマッチしたセカンダリインデックスのネクストキーロックと次のレコードとの間のギャップロック、そしてマッチした行のレコードロックを取得する。マッチしなかった場合、セカンダリインデックスのみ条件の値を含む区間のギャップロックを取得する。
* インデックスを使わない`select ... for update`はマッチした行のネクストキーロックを取得する。

当たり前といえばそうなるけど、ロックを取得する場合でも可能な限りインデックスを利用してロックの範囲を狭めることが重要ということがわかった。

また、セカンダリインデックスを使った場合のロックの範囲は直感的には理解しにくいため、ハマりやすいポイントかもしれないが、今回いろいろ試してみることで理解が深まってよかった。
