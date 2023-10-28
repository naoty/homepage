---
title: cp-kafkaでruby-kafkaを試してみる
time: 2020-07-19 19:09
tags: ["kafka", "ruby"]
---

[前回](/427/)、cp-kafkaを使ってKafkaの検証環境を用意したので、今度はRubyで簡単なproducerとconsumerを書いてみる。

前回用意したdocker-composeから`kafka-topic`コマンドで`greetings`トピックを作っておく。

```bash
% docker-compose exec kafka kafka-topic \
  --create \
  --zookeeper zookeeper:32181 \
  --partitions 1 \
  --replication-factor 1 \
  --topic greetings
```

* `--partitions 1`でこのトピックのパーティション数が1つだけ。
* `--replication-factor 1`でパーティションのレプリカの数を表している。この値はパーティション数に対する倍数なので、1の場合はレプリカなしになる。

# producer

[ruby-kafka](https://github.com/zendesk/ruby-kafka)を使って簡単なproducerを作る。

```ruby
# producer.rb
require "bundler/inline"

gemfile do
  source "https://rubygems.org"
  gem "ruby-kafka"
end

kafka = Kafka.new(["localhost:9092"], client_id: "hello-kafka")
kafka.deliver_message("Hello, World!", key: "hello", topic: "greetings")
```

* `Kafka.new`の第1引数はseed brokerのホスト名のリスト。
* `Kafka.new`の第2引数はclient idで、任意だけどクライアントを識別するために使うので指定するのが推奨。

```bash
% ruby producer.rb
```

kafkacatでconsumerを起動してproducerが送った値を受け取る。

```bash
% kafka -b localhost:9092 -t greetings
% Auto-selecting consumer mode (use -P or -C to override)
% Reached end of topic greetings [0] at offset 0
Hello, World!
```

* `-b`はbrokerのホストを指す。
* `-t`はトピックを指す。

Rubyで書いたproducerから送ったメッセージをconsumerから確認できた。

# consumer

同様にruby-kafkaで簡単なconsumerを作る。

```ruby
# consumer.rb
require "bundler/inline"

gemfile do
  source "https://rubygems.org"
  gem "ruby-kafka"
end

kafka = Kafka.new(["localhost:9092"])
kafka.each_message(topic: "greetings") do |message|
  puts "offset:#{message.offset}\tkey:#{message.key}\tvalue:#{message.value}"
end
```

kafkacatでproducerを起動してメッセージを送る。

```bash
% echo "hello:Hello, World" | kafkacat -b localhost:9092 -t greetings -K :
```

* `-K`でメッセージとキーを分割するデリミタを指定できる。

```bash
% ruby consumer.rb
offset:0    key:hello   value:Hello, World
```

producerから送ったメッセージをRubyで書いたconsumerで取得することができた。
