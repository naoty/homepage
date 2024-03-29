---
title: Kafka Streams入門2(Statefulな操作)
time: 2022-02-27 10:24
tags: ["kafka"]
---

[前回](/470/)はstatelessな操作を試してみたので、statefulな操作のうち簡単なものだけ動かしてみた。

sourceとなるtopicには以下のようにしてレコードを流している。

```bash
% echo "a:naoty" | kcat -b localhost:9092 -t streams-plaintext-input -K :
% echo "a:naoty" | kcat -b localhost:9092 -t streams-plaintext-input -K :
% echo "b:naoty" | kcat -b localhost:9092 -t streams-plaintext-input -K :
```

# count

```java
final StreamsBuilder builder = new StreamsBuilder();
final KStream<String, String> source = builder.stream("streams-plaintext-input");
source.groupByKey()
      .count()
      .toStream()
      .print(Printed.toSysOut());
```

```
[KTABLE-TOSTREAM-0000000003]: a, 1
[KTABLE-TOSTREAM-0000000003]: a, 2
[KTABLE-TOSTREAM-0000000003]: b, 1
```

# reduce

```java
final StreamsBuilder builder = new StreamsBuilder();
final KStream<String, String> source = builder.stream("streams-plaintext-input");
source.groupByKey()
      .reduce((result, value) -> result + value)
      .toStream()
      .print(Printed.toSysOut());
```

```
[KTABLE-TOSTREAM-0000000003]: a, naoty
[KTABLE-TOSTREAM-0000000003]: a, naotynaoty
[KTABLE-TOSTREAM-0000000003]: b, naoty
```

# aggregate

```java
final StreamsBuilder builder = new StreamsBuilder();
final KStream<String, String> source = builder.stream("streams-plaintext-input");
source.groupByKey()
        .aggregate(() -> "", (resultKey, value, result) -> result + value.toUpperCase())
        .toStream()
        .print(Printed.toSysOut());
```

```
[KTABLE-TOSTREAM-0000000003]: a,        NAOTY
[KTABLE-TOSTREAM-0000000003]: a,        NAOTYNAOTY
[KTABLE-TOSTREAM-0000000003]: b,        NAOTY
```

なぜか先頭にゴミが入ってしまった。

# 整理
* `groupByKey`, `group`などのメソッドで集約する単位を定義した`KGroupedStream`を返す。
* `KGroupedStream`に対して`count`などの集約するメソッドが実行でき、これらは`KTable`を返す。上流から流れてきたレコードはState Storeと呼ばれるローカルのキーバリューストアに保存され、更新があったレコードを下流に流す。
* `KTable`に対して`toStream()`を実行すると、更新されたレコードが流れる`KStream`が返る。
