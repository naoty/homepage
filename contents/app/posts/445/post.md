---
title: 手を動かしながらロックを学ぶ 1
time: 2021-06-07 22:47
tags: ["mysql"]
---

* Part 1: `select`による特定の一行に対するロック
* [Part 2](/446/): `select`による複数行に対するロック
* [Part 3](/447/): `insert`, `update`, `delete`によるロック

いつまで経ってもロックについて理解したと言えなかったので、ロックについて手を動かしながら学んでみることにした。

MySQLが公式にサンプルデータとして提供している[world](https://dev.mysql.com/doc/world-setup/en/)データベースと、補完が使えて便利なMySQLクライアントである[mycli](https://www.mycli.net/)をインストールした[Dockerイメージ](https://github.com/naoty/mysql-playground)を作ったので、それを使って試してみる。

今回は以下のような`city`テーブルに対して特定の一行へのロックをとったときについて試してみる。

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
Time: 0.003s
```

# 共有ロック
トランザクションT1で`select ... lock in share mode`を実行して共有ロックをとる。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> select * from city where ID = 1 lock in share mode
+----+-------+-------------+----------+------------+
| ID | Name  | CountryCode | District | Population |
+----+-------+-------------+----------+------------+
| 1  | Kabul | AFG         | Kabol    | 1780000    |
+----+-------+-------------+----------+------------+

1 row in set
Time: 0.010s
```

別のトランザクションT2で同じ行を`select`することはできたが、`update`することはできなかった。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> select * from city where ID = 1;
+----+-------+-------------+----------+------------+
| ID | Name  | CountryCode | District | Population |
+----+-------+-------------+----------+------------+
| 1  | Kabul | AFG         | Kabol    | 1780000    |
+----+-------+-------------+----------+------------+

1 row in set
Time: 0.009s
MySQL (none)@(none):world> select * from city where ID = 1 lock in share mode;
+----+-------+-------------+----------+------------+
| ID | Name  | CountryCode | District | Population |
+----+-------+-------------+----------+------------+
| 1  | Kabul | AFG         | Kabol    | 1780000    |
+----+-------+-------------+----------+------------+

1 row in set
Time: 0.009s
MySQL (none)@(none):world> select * from city where ID = 1 for update;
(1205, 'Lock wait timeout exceeded; try restarting transaction')
MySQL (none)@(none):world> update city set `Population` = 100 where `ID` = 1;
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

# 排他ロック
トランザクションT1で`select ... for update`を実行して排他ロックをとる。

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

別のトランザクションT2で同じ行を`select`することはできたが、`select ... lock in share mode`や`select ... for update`や`update`はロック取得待ちになった。

```sql
MySQL (none)@(none):world> begin
Query OK, 0 rows affected
Time: 0.001s
MySQL (none)@(none):world> select * from city where ID = 1;
+----+-------+-------------+----------+------------+
| ID | Name  | CountryCode | District | Population |
+----+-------+-------------+----------+------------+
| 1  | Kabul | AFG         | Kabol    | 1780000    |
+----+-------+-------------+----------+------------+

1 row in set
Time: 0.012s
MySQL (none)@(none):world> select * from city where ID = 1 lock in share mode;
(1205, 'Lock wait timeout exceeded; try restarting transaction')
MySQL (none)@(none):world> select * from city where ID = 1 for update;
(1205, 'Lock wait timeout exceeded; try restarting transaction')
MySQL (none)@(none):world> update city set `Population` = 100 where `ID` = 1;
(1205, 'Lock wait timeout exceeded; try restarting transaction')
```

# まとめ
特定の行に対するロックをとったとき、別のトランザクションからの操作がどうなるかまとめるとこうなった。

| T1\T2                         | select | select ... lock in share mode | select ... for update | update |
| ----------------------------- | ------ | ----------------------------- | --------------------- | ------ |
| select ... lock in share mode | 可     | 可                            | ロック待ち                  | ロック待ち   |
| select ... for update         | 可     | ロック待ち                          | ロック待ち                  | ロック待ち   |

