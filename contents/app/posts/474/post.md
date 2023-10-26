---
title: Kafka Streams入門4(Join)
time: 2022-03-01 22:00
tags: ["kafka"]
---

[前回](/473/)とりあげたwindowに続いて、joinも動かしながら理解してみる。joinはいろいろなバリエーションがあるため、基本的なinner joinに絞ってKStream同士の場合とKStreamとKTableの場合を動かしてみた。

# KStream同士のinner join

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> left = builder.stream("streams-plaintext-left-input");
KStream<String, String> right = builder.stream("streams-plaintext-right-input");
left.join(
      right,
      (leftValue, rightValue) -> "left: %s, right: %s".formatted(leftValue, rightValue),
      JoinWindows.ofTimeDifferenceWithNoGrace(Duration.ofSeconds(30))
    )
    .print(Printed.toSysOut());
```

```bash
% echo "hello:alice" | kcat -b localhost:9092 -t streams-plaintext-left-input -K :
% echo "hello:bob" | kcat -b localhost:9092 -t streams-plaintext-right-input -K :
#=> [KSTREAM-MERGE-0000000006]: hello, left: alice, right: bob
% echo "hello:naoty" | kcat -b localhost:9092 -t streams-plaintext-left-input -K :
#=> [KSTREAM-MERGE-0000000006]: hello, left: naoty, right: bob
% echo "hello:naoty" | kcat -b localhost:9092 -t streams-plaintext-right-input -K :
#=> [KSTREAM-MERGE-0000000006]: hello, left: naoty, right: naoty
```

```bash
# 30秒経過後
% echo "hello:alice" | kcat -b localhost:9092 -t streams-plaintext-left-input -K :
% echo "hello:bob" | kcat -b localhost:9092 -t streams-plaintext-right-input -K :
#=> [KSTREAM-MERGE-0000000006]: hello, left: alice, right: bob
```

* キーが一致するレコードがもう片方のKStreamに流れるのをwindowで指定した期間だけ待つ。
* キーが一致するレコードを受けとったら、joinerを呼んでその結果を下流に流す。
* 期間内にキーが一致するレコードを受け取らなかったら、windowが閉じる。

# KStreamとKTableのinner join

```java
StreamsBuilder builder = new StreamsBuilder();
KStream<String, String> left = builder.stream("streams-plaintext-left-input");
KTable<String, String> right = builder.table("streams-plaintext-right-input");
left.join(
      right,
      (leftValue, rightValue) -> "left: %s, right: %s".formatted(leftValue, rightValue),
    )
    .print(Printed.toSysOut());
```

```bash
% echo "hello:naoty" | kcat -b localhost:9092 -t streams-plaintext-left-input -K :
% echo "hello:alice" | kcat -b localhost:9092 -t streams-plaintext-right-input -K :
% echo "hello:naoty" | kcat -b localhost:9092 -t streams-plaintext-left-input -K :
#=> [KSTREAM-JOIN-0000000004]: hello, left: naoty, right: alice
% echo "hello:bob" | kcat -b localhost:9092 -t streams-plaintext-right-input -K :
% echo "hello:naoty" | kcat -b localhost:9092 -t streams-plaintext-left-input -K :
#=> [KSTREAM-JOIN-0000000004]: hello, left: naoty, right: bob
```

* KTableとのjoinの場合は時間の制限が必要ないため、windowは指定しなくていい。
* KStreamで受け取ったレコードのキーがKTableにも存在すれば、下流にjoinerの結果を流す。
* KTableの更新時には下流にはレコードが流れないが、次にKStreamで同じキーを受け取った場合には更新が反映されている。

# tips：kcatでtombstoneを送る方法
KTableのレコードを削除したい場合などでkcatでtombstoneを送りたい場合、ただ空文字列を指定するだけでは空文字列が登録されるだけなので、`-Z`オプションが必要になる。

```bash
% echo "hello:" | kcat -b localhost:9092 -t streams-plaintext-right-input -K : -Z
```
