---
title: cp-kafkaでKafkaの動作環境を用意する
time: 2020-07-18 20:17
tags: ["kafka", "docker"]
---

以前書いた[記事](/421/)でKafka用のDockerイメージを自作していたけど、Kafkaのマネージドサービスを提供しているConfluent社が公開している[confluentinc/cp-kafka](https://hub.docker.com/r/confluentinc/cp-kafka/)というDockerイメージを使うのが手っ取り早いことに気づいた。

```yaml
# docker-compose.yml
version: "3"
services:
  kafka:
    image: confluentinc/cp-kafka
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:32181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    ports:
      - 9092:9092
    depends_on:
      - zookeeper
  zookeeper:
    image: confluentinc/cp-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 32181
```

Kafkaと一緒に使うzookeeperもConfluent社が用意しているものがあるのでそれを使う。各イメージの設定は環境変数から変更できるようになっている。Confluent社の[ドキュメント](https://docs.confluent.io/current/installation/docker/config-reference.html)を参考にするといい。

```bash
% docker-compose up -d
% kafkacat -L -b localhost:9092
Metadata for all topics (from broker 1001: localhost:9092/1001):
 1 brokers:
  broker 1001 at localhost:9092 (controller)
 1 topics:
  topic "__confluent.support.metrics" with 1 partitions:
    partition 0, leader 1001, replicas: 1001, isrs: 1001
```

ホストから[kafkacat](https://github.com/edenhill/kafkacat)でコンテナ上のKafkaと疎通確認ができた。
