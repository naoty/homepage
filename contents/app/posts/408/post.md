---
title: HiveをDockerで動かす
description: Hadoopに引き続きHiveをDockerコンテナで動かそうと試みた話です
time: 2020-03-14 17:44
tags: ["hadoop", "docker"]
---

[公式ドキュメント](https://cwiki.apache.org/confluence/display/Hive/GettingStarted)に従ってHiveのDockerイメージをつくっていく。今回は2系を動かす。

すべてのコードは[naoty/hello-hive](https://github.com/naoty/hello-hive)にある。

# Java
Java 1.8への移行が推奨されているので、`openjdk:8`をベースイメージに使う。

```diff
+FROM openjdk:8
```

# Hadoop
Hive 2系に合わせてHadoopも2系をインストールする。以前の[ブログ](/406/)で紹介したとおり、HadoopをDockerコンテナで動かすには下のようなことが必要になる。

* sshdのセットアップ
* Hadoopのダウンロード
* HDFSのフォーマット

```diff
 FROM openjdk:8

+# sshd
+RUN apt-get update \
+  && apt-get install -y --no-install-recommends ssh \
+  && apt-get clean \
+  && rm -rf /var/lib/apt/lists/*
+RUN mkdir /run/sshd \
+  && ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa \
+  && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys \
+  && chmod 0600 ~/.ssh/authorized_keys
+
+# Hadoop
+RUN wget -q -O - http://ftp.tsukuba.wide.ad.jp/software/apache/hadoop/common/hadoop-2.9.2/hadoop-2.9.2.tar.gz | tar zxf -
+ENV PATH=/hadoop-2.9.2/bin:/hadoop-2.9.2/sbin:$PATH
+COPY config/hadoop /hadoop-2.9.2/etc/hadoop/
+RUN hdfs namenode -format
```

# Hive

```diff
 FROM openjdk:8

 # sshd
 RUN apt-get update \
   && apt-get install -y --no-install-recommends ssh \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
 RUN mkdir /run/sshd \
   && ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa \
   && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys \
   && chmod 0600 ~/.ssh/authorized_keys
 
 # Hadoop
 RUN wget -q -O - http://ftp.tsukuba.wide.ad.jp/software/apache/hadoop/common/hadoop-2.9.2/hadoop-2.9.2.tar.gz | tar zxf -
 ENV PATH=/hadoop-2.9.2/bin:/hadoop-2.9.2/sbin:$PATH
 COPY config/hadoop /hadoop-2.9.2/etc/hadoop/
 RUN hdfs namenode -format

+# Hive
+RUN wget -q -O - http://ftp.tsukuba.wide.ad.jp/software/apache/hive/hive-2.3.6/apache-hive-2.3.6-bin.tar.gz | tar zxf -
+ENV HIVE_HOME=/apache-hive-2.3.6-bin PATH=/apache-hive-2.3.6-bin/bin:$PATH
+COPY config/hive /apache-hive-2.3.6-bin/conf/
```

# 起動スクリプト
コンテナの起動スクリプトを追加し、下のようなことを起動時におこなうようにする。

* sshdの起動（Hadoopの起動に必要）
* HadoopのNameNodeとDataNodeデーモンの起動
* Hiveが使うHDFSの初期化
* Hive metastoreの初期化（今回は埋め込み型のmetastoreを使う）
* hiveserver2の起動（コンテナ外部から接続してHiveQLを利用できるようにするため）

```bash
#!/bin/bash -ex

/usr/sbin/sshd
start-dfs.sh

hdfs dfs -mkdir -p /tmp
hdfs dfs -mkdir -p /user/hive/warehouse
hdfs dfs -chmod g+w /tmp
hdfs dfs -chmod g+w /user/hive/warehouse

schematool -dbType derby -initSchema

hiveserver2
```

```diff
 FROM openjdk:8

 # sshd
 RUN apt-get update \
   && apt-get install -y --no-install-recommends ssh \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
 RUN mkdir /run/sshd \
   && ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa \
   && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys \
   && chmod 0600 ~/.ssh/authorized_keys
 
 # Hadoop
 RUN wget -q -O - http://ftp.tsukuba.wide.ad.jp/software/apache/hadoop/common/hadoop-2.9.2/hadoop-2.9.2.tar.gz | tar zxf -
 ENV PATH=/hadoop-2.9.2/bin:/hadoop-2.9.2/sbin:$PATH
 COPY config/hadoop /hadoop-2.9.2/etc/hadoop/
 RUN hdfs namenode -format

 # Hive
 RUN wget -q -O - http://ftp.tsukuba.wide.ad.jp/software/apache/hive/hive-2.3.6/apache-hive-2.3.6-bin.tar.gz | tar zxf -
 ENV HIVE_HOME=/apache-hive-2.3.6-bin PATH=/apache-hive-2.3.6-bin/bin:$PATH
 COPY config/hive /apache-hive-2.3.6-bin/conf/

+WORKDIR /root
+COPY start /root/
+CMD ["./start"]
```

# 動作確認
hiveserver2を起動する。

```bash
% docker build -t naoty/hello-hive .
% docker run --rm -it naoty/hello-hive
```

beelineを使ってhiveserver2に接続する。

```bash
% docker exec xxxxxxxx -it beeline -u jdbc:hive2://localhost:10000
0: jdbc:hive2://localhost:10000> 
```
