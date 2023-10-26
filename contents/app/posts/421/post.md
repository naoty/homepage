---
title: KafkaのDockerイメージを用意する
time: 2020-06-24 23:05
tags: ["kafka", "docker"]
---

そろそろKafkaを手を動かしながら学ぶ必要が出てきたので、簡単に試せるようにDockerイメージを用意した。

```dockerfile
FROM openjdk:11-jre

RUN apt-get update

# Kafka
RUN wget -q -O - http://ftp.meisei-u.ac.jp/mirror/apache/dist/kafka/2.5.0/kafka_2.12-2.5.0.tgz | tar xzf - && \
  mv /kafka_2.12-2.5.0 /kafka
ENV PATH=/kafka/bin:$PATH

WORKDIR /root/
COPY start.sh  /root/
CMD ["./start.sh"]
```

* Java 11がサポートされているのでOpenJDK 11をベースイメージにする。
* ダウンロードリンクからダウンロードして展開する。
* ZooKeeperとKafkaを同時に起動する必要があるので、起動スクリプトを用意する。

```shell
#!/bin/bash -e

/kafka/bin/zookeeper-server-start.sh /kafka/config/zookeeper.properties &
/kafka/bin/kafka-server-start.sh /kafka/config/server.properties
```

* [Quickstart](https://kafka.apache.org/quickstart)に載っているようにZooKeeperとKafkaを起動する。
