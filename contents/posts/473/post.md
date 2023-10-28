---
title: Kafka Streams入門3(Window)
time: 2022-02-27 10:39
tags: ["kafka"]
---

[前回](/472/)では簡単なstatefulな操作を扱ったので、今回はwindowを伴う操作を動かしてみた。

# Hopping time windows
Hopping time windowはお互いに重なり合う一定期間のtime windowのことで、期間のことをwindow size、time windowが生成される感覚をhopと呼ぶ。

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> source = builder.stream("streams-plaintext-input");
source.groupByKey()
        .windowedBy(
          TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1))
                     .advanceBy(Duration.ofSeconds(30))
        )
        .count()
        .toStream()
        .print(Printed.toSysOut());
```

```
[KTABLE-TOSTREAM-0000000002]: [a@1645928070000/1645928130000], 1
[KTABLE-TOSTREAM-0000000002]: [a@1645928100000/1645928160000], 1
[KTABLE-TOSTREAM-0000000002]: [a@1645928070000/1645928130000], 2
```

* `1645928070000`のような数値はミリ秒単位のunixtimeで、`[a@1645928070000/1645928130000]`はキー`a`の1分間の（window size = 1分）time windowを表している。
* 確かに30秒ずつずれた（hop = 30秒）time windowごとに集計されていることがわかる。

# Tumbling time windows
Tumbling time windowsはお互いに重なり合わない一定期間のtime windowのことで、window sizeとhopが同じ値のhopping time windowsとも言える。

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> source = builder.stream("streams-plaintext-input");
source.groupByKey()
        .windowedBy(
          TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1))
        )
        .count()
        .toStream()
        .print(Printed.toSysOut());
```

```
[KTABLE-TOSTREAM-0000000002]: [a@1645967820000/1645967880000], 2
[KTABLE-TOSTREAM-0000000002]: [a@1645967880000/1645967940000], 1
```

* 1分間のtime windowで、重複がないことがわかる。

# Sliding time windows
joinで使われるようなので、joinのときにあらためて理解したい。

# Session windows
Session windowsは一連のレコードをセッション化するためのwindowで、あるレコードから一定期間（inactivity gap）内に同じキーをもつレコードを受け取ると同じwindowに含める。ユーザー行動分析などの用途で便利。

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> source = builder.stream("streams-plaintext-input");
source.groupByKey()
        .windowedBy(
          SessionWindows.ofInactivityGapWithNoGrace(Duration.ofSeconds(30))
        )
        .count(Materialized.as("wordcounts"))
        .toStream()
        .print(Printed.toSysOut());
```

```
[KTABLE-TOSTREAM-0000000002]: [a@1646006322519/1646006327264], 3
[KTABLE-TOSTREAM-0000000002]: [a@1646006357869/1646006357869], 1
```

* 最後のレコードを受け取ってから30秒後に下流にレコードが送られているようだ。
