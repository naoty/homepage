---
title: Kafka Streams入門1(環境構築とStatelessな操作)
time: 2022-02-19 21:13
tags: ["kafka"]
---

Kafka Streamsに入門する機運が出てきたため、実際に動かしてみながら学んでみることにした。

# Kafka Streamsとは
Kafkaとのメッセージの送信/取得、そしてメッセージの処理のためのJavaのライブラリ。

Kafkaからメッセージを取得して、それをリアルタイムに処理して、またKafkaに送ったり、別のデータストアに書き込んだりするようなアプリケーションを書く際にフレームワークとして使われている。

# 開発環境のセットアップ
以前の[記事](/427/)でDockerコンテナでKafkaの動作環境をセットアップする方法を紹介した。今回もそれに沿ってセットアップした。以下再掲。

```yaml
version: "3"
services:
  kafka:
    image: confluentinc/cp-kafka
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - 9092:9092
    depends_on:
      - zookeeper
  zookeeper:
    image: confluentinc/cp-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
```

また、Kafka Streamsアプリケーションのプロジェクトのセットアップについては、これも以前の[記事](/467/)で紹介したミニマムなgradleプロジェクトを参考にセットアップして動作するようになった。build.gradleはこんな感じ。

```groovy
plugins {
  id 'application'
}

application {
  mainClass = 'dev.naoty.kafka.Main'
}

repositories {
  mavenCentral()
}

dependencies {
  implementation 'org.apache.kafka:kafka-streams:3.1.0'
}
```

# 動かしてみる
Kafka StreamsにはStreams DSLとProcessor APIという2種類の書き方が存在するが、今回はより簡単なStreams DSLを使って動かしてみる。

実際のコード全体は記事の一番下に載せたけど、重要な箇所だけを切り抜く。

```java
final StreamsBuilder builder = new StreamsBuilder();
final KStream<String, String> source = builder.stream("streams-plaintext-input");
source.peek((key, value) -> System.out.printf("key:%s, value:%s\n", key, value)).print(Printed.toSysOut());
source.mapValues(value -> value.toUpperCase()).print(Printed.toSysOut());
source.map((key, value) -> KeyValue.pair(key.toUpperCase(), value.toUpperCase())).print(Printed.toSysOut());
source.filter((key, value) -> value.length() > 3).print(Printed.toSysOut());
source.selectKey((key, value) -> value).print(Printed.toSysOut());
```

* `StreamsBuilder#stream`で`streams-plaintext-input`というtopicからメッセージを取得する`KStream`を生成している
* `KStream`に対して`map`や`filter`などのおなじみのメソッドでメッセージを処理できる。当然メソッドチェーンもできる。
* `peek`は受け取ったメッセージに何もしないため、処理のチェーンの中で副作用を発生させるのに便利。例えば、この例のようにログを出力できる。Rubyの`#tap`みたいなやつ。
* `selectKey`を使うとキーを変更できる。
* `print`を使うと標準出力やファイルにメッセージを出力できるが、これは終端でしか使えないため、メソッドチェーンできない。

kcat（旧kafkacat）を使って`streams-plaintext-input`にメッセージを送ると、標準出力に処理されたメッセージが出力された。

```bash
% echo "hello:naoty" | kcat -b localhost:9092 -t streams-plaintext -K :
```

```
key:hello, value:naoty
[KSTREAM-PEEK-0000000001]: hello, naoty
[KSTREAM-MAPVALUES-0000000003]: hello, NAOTY
[KSTREAM-MAP-0000000005]: HELLO, NAOTY
[KSTREAM-FILTER-0000000007]: hello, naoty
[KSTREAM-KEY-SELECT-0000000009]: naoty, naoty
```

# コード全体

```java
public class Main {
  public static void main(String[] args) {
    Properties props = new Properties();
    props.put(StreamsConfig.APPLICATION_ID_CONFIG, "my-first-streams-app");
    props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
    props.put(StreamsConfig.DEFAULT_KEY_SERDE_CLASS_CONFIG, Serdes.String().getClass());
    props.put(StreamsConfig.DEFAULT_VALUE_SERDE_CLASS_CONFIG, Serdes.String().getClass());

    final StreamsBuilder builder = new StreamsBuilder();
    final KStream<String, String> source = builder.stream("streams-plaintext-input");
    source.peek((key, value) -> System.out.printf("key:%s, value:%s\n", key, value)).print(Printed.toSysOut());
    source.mapValues(value -> value.toUpperCase()).print(Printed.toSysOut());
    source.map((key, value) -> KeyValue.pair(key.toUpperCase(), value.toUpperCase())).print(Printed.toSysOut());
    source.filter((key, value) -> value.length() > 3).print(Printed.toSysOut());
    source.selectKey((key, value) -> value).print(Printed.toSysOut());

    final Topology topology = builder.build();
    final KafkaStreams streams = new KafkaStreams(topology, props);
    final CountDownLatch latch = new CountDownLatch(1);

    Runtime.getRuntime().addShutdownHook(new Thread("streams-shutdown-hook") {
      @Override
      public void run() {
        streams.close();
        latch.countDown();
      }
    });

    try {
      streams.start();
      latch.await();
    } catch (Throwable e) {
      System.exit(1);
    }
    System.exit(0);
  }
}
```
