---
title: データ分析基盤の全体像を整理してみる
time: 2019-05-19T12:44:00+0900
description: 「ビッグデータを支える技術」を読んでデータ分析基盤の全体像を整理してみる話です。
tags: ["bigdata", "book"]
---

仕事ではインフラエンジニアとしてAWS上のサービスを保守・運用しているのだけど、いずれデータ分析基盤のような大規模なシステムにも関わってみたいと思うようになり、最近は「[ビッグデータを支える技術](https://gihyo.jp/book/2017/978-4-7741-9225-3)」を読んでいる。

データ分析基盤と聞くと、データなんとかみたいな概念だったり、Hadoop界隈のさまざまな技術が頭に浮かぶんだけど、いまいち何をなんのために使うのかわかってない。そこで、この本を参考にデータが生まれて分析に利用されるまでの全体像を整理してみたい。

# 全体像
* ユーザーの入力から生まれるローデータをバルク型データ転送やストリーム型データ転送によって分散ストレージに保存する。
* 分散ストレージに保存されたビッグデータを大規模分散処理フレームワークを使って分析に適した形式に変換し、列指向データベースに転送する。
* 列指向データベースに保存されたビッグデータはダッシュボードツールやBIツールで分析され、可視化される。
* これらの一連のプロセスをワークフローエンジンで管理する。

# ローデータ
ユーザーがフォームから入力したデータ、Webサーバーのアクセスログなど。

# バルク型データ転送
定期的にまとまったデータを分散ストレージに保存すること。その際にCSVなどの標準的なフォーマットに変換したり、適切なサイズにデータをまとめたり分割することで効率的に保存できるようにする。

このプロセスで使われる技術として、[Embulk](https://www.embulk.org)がある。

# ストリーム型データ転送
リアルタイムに生成されるデータを分散ストレージに保存すること。高頻度に生成されるデータをそのまま分散ストレージに書き込もうとすると、書き込み性能の限界に到達してしまう。そこで、メッセージブローカという仕組みを使い、一時的にデータを溜めて、分散ストレージに書き込むデータの量を調整する。

このプロセスで使われる技術として、[Apache Kafka](https://kafka.apache.org/)、[Amazon Kinesis](https://aws.amazon.com/jp/kinesis/)、[fluentd](https://www.fluentd.org/)がある。

# 分散ストレージ
複数のコンピュータやディスクからなるストレージのこと。ストレージを追加することでデータ容量を増やすことができ、スケーラビリティがある。分散ストレージとして使われるのは、オブジェクトストレージやNoSQLデータベースがある。

分散ストレージに保存されるのは、アクセスログのような非構造化データ、CSVやJSONといった半構造化データとなる。

オブジェクトストレージとしては[Amazon S3](https://aws.amazon.com/jp/s3/)やHDFSがあり、NoSQLデータベースとしては[Apache Cassandra](http://cassandra.apache.org/)や[Amazon DynamoDB](https://aws.amazon.com/jp/dynamodb/)がある。

# 大規模分散処理フレームワーク
分散ストレージに保存された非構造化データや半構造化データを構造化データに変換したり、集計したり、列指向データベースに保存したりするために大規模分散処理フレームワークを使う。

この変換や集計やスキーマの定義にプログラムではなくSQLを使うためクエリエンジンを利用する。

分散処理フレームワークとしては[Apache Hadoop](https://hadoop.apache.org/)や[Apache Spark](https://spark.apache.org/)があり、クエリエンジンとしては[Apache Hive](https://hive.apache.org/)、[presto](https://prestodb.github.io/)、[Apache Impala](https://impala.apache.org/)、[Spark SQL](https://spark.apache.org/sql/)があり、またマネージドな分散処理サービスでは[Amazon EMR](https://aws.amazon.com/jp/emr/)や[Cloud Dataproc](https://cloud.google.com/dataproc/)がある。

# 列指向データベース
カラム単位でデータを圧縮するデータベースのことで、カラム単位での集計に最適化されている。一般的なRDBは行指向データベースで高速な集計処理には大量のメモリが必要になってしまう。

列指向データベースとして利用されるのは、[Google BigQuery](https://cloud.google.com/bigquery/)や[Amazon Redshift](https://aws.amazon.com/jp/redshift/)や[Treasure Data](https://www.treasuredata.co.jp/)がある。

# BIツール
データを定期的にモニタリングしたり詳細なデータを探索するためにBIツールを使う。

BIツールとして利用されるのは、[Tableau](https://www.tableau.com)がある。

# ワークフローエンジン
一連のデータ処理のプロセスを定期的に実行したり、タスク間の依存関係を解決して決められた順番で実行したり、エラー時にはリトライさせるためにワークフローエンジンを使う。

ワークフローエンジンとして利用されるのは、[Rundeck](https://www.rundeck.com/open-source)、[Apache Airflow](https://airflow.apache.org/)、[Luigi](https://luigi.readthedocs.io)、[Azkaban](https://azkaban.github.io/)、[digdag](https://www.digdag.io/)がある。
