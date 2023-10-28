---
title: PumaのメトリクスをDatadogに送る
time: 2019-06-30T17:18:00+0900
tags: ["rails", "datadog"]
---

普段、Datadogを使ってシステムを監視している。AWSの各サービスはCloudWatch metricsを通してDatadogから監視できるんだけど、今回はRailsアプリケーションサーバーであるPumaをDatadogから監視できるようにする。

# DogStatsD
DatadogのIntegrationにPumaはないため、カスタムメトリクスを送ることになる。DogStatsDを使うと簡単にカスタムメトリクスを送ることができる。DogStatsDはdatadog-agentに同梱されており、受け取ったカスタムメトリクスをDatadogに転送する。また、[StatsD](https://github.com/statsd/statsd)と同じプロトコルを実装しているため、StatsDクライアントはDogStatsDを通してDatadogにメトリクスを送ることができる。

# Pumaのメトリクス
Pumaは`Puma.stats`から以下のようなメトリクスを取得することができる。

* `backlog`: スレッドによる処理を待つコネクション数
* `running`: 実行中のスレッド数
* `pool_capacity`: 現在サーバーが取得できるリクエスト数
* `max_threads`: 最大スレッド数

# puma-plugin-statsd
[puma-plugin-statsd](https://github.com/yob/puma-plugin-statsd)は`Puma.stats`から取得したメトリクスをStatsDサーバーに送る。Pumaのプラグインなので、以下のように`config/puma.rb`に指定する。

```ruby
plugin :statsd
```

そして、起動時に環境変数`STATSD_HOST`でStatsDサーバーのホストを指定する。DogStatsDを使う場合、datadog-agentのホストを指定すればいい。

これで、PumaのメトリクスがDatadogに送られるようになる。
