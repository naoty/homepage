---
title: docker composeでcassandraクラスターを動かす
time: 2021-06-30 23:53
tags: ["cassandra"]
---

# クラスターの起動
docker for macのVMに割り当てるメモリを4GBまで上げたら起動した。

```yaml
version: "3"
services:
  cassandra1:
    image: cassandra
    environment:
      CASSANDRA_SEEDS: cassandra1
  cassandra2:
    image: cassandra
    environment:
      CASSANDRA_SEEDS: cassandra1
    depends_on:
      - cassandra1
```

コンテナにログインして`nodetool status`を実行すると、複数台のノードでクラスターが構成されていることがわかる。

```bash
% nodetool status

Datacenter: datacenter1
=======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
UN  172.18.0.2  146.6 KiB  256          100.0%            410c863f-f3e8-41e6-b297-f0f1e3bd7d33  rack1
UN  172.18.0.3  70.72 KiB  256          100.0%            a8585f68-ab42-4c87-a416-49fd48daadf7  rack1
```

# パーティションの確認
`nodetool ring`を実行すると、各ノードが担当するトークンの範囲がわかる。

```bash
% nodetool ring

Datacenter: datacenter1
==========
Address     Rack        Status State   Load            Owns                Token
                                                                           9205355899184488755
172.18.0.3  rack1       Up     Normal  227.44 KiB      100.00%             -9182155964809320561
172.18.0.3  rack1       Up     Normal  227.44 KiB      100.00%             -9173740678595215345
172.18.0.2  rack1       Up     Normal  215.57 KiB      100.00%             -9155666247780803709
# (snip)
172.18.0.3  rack1       Up     Normal  227.44 KiB      100.00%             9151380247043298877
172.18.0.2  rack1       Up     Normal  215.57 KiB      100.00%             9160375385280096791
172.18.0.2  rack1       Up     Normal  215.57 KiB      100.00%             9205355899184488755
```

`172.18.0.2`と`172.18.0.3`のノードそれぞれに`Token`が割り当てられている。`Token`の値は担当範囲の最後の値を表している。トークンはリング状に配置されるため、上の例で言うと最大値`9205355899184488755`の次の値は最小値`-9182155964809320561`ということになる。

次に実際にデータがどのパーティションに保存されているか確認する。まずは、適当なテーブルを追加してデータを入れる。

```
cqlsh:hello> create table users (id bigint primary key, name text);
cqlsh:hello> insert into users (id, name) values (1, 'alice');
cqlsh:hello> insert into users (id, name) values (2, 'bob');
cqlsh:hello> select * from users;

 id | name
----+-------
  2 |   bob
  1 | alice

(2 rows)
```

`TOKEN`関数を使うと、渡した値からトークンとなる値を計算できる。パーティションキーを渡してトークンを計算してみる。

```
cqlsh:hello> select id, token(id) from users;

 id | system.token(id)
----+----------------------
  2 | -8218881827949364593
  1 |  6292367497774912474

(2 rows)
```

これらの値と`nodetool ring`で見たトークンの範囲と見比べることで、その行がどのノードに保存されているか確認できる。先程の`nodetool ring`の結果を再掲すると以下のようになっている。

```bash
172.18.0.3  rack1       Up     Normal  227.44 KiB      100.00%             -8312964340927482628
172.18.0.2  rack1       Up     Normal  215.57 KiB      100.00%             -8169459460287760239
# (snip)
172.18.0.2  rack1       Up     Normal  215.57 KiB      100.00%             6147470985463054203
172.18.0.2  rack1       Up     Normal  215.57 KiB      100.00%             6312725102659141435
```

よって、`id:2`の行は`172.18.0.2`のノードに、`id:1`の行は同じく`172.18.0.2`のノードに保存されていることがわかった。
