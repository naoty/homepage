---
title: HadoopをDockerコンテナで動かす
description: Hadoopまわりを勉強するためDockerコンテナを作ってみた話
time: 2020-03-04 10:50
tags: ["hadoop", "docker"]
---

[公式ドキュメント](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/SingleCluster.html)を見ながらDockerイメージをセットアップしていく。

# Javaをインストールする

```diff
+FROM openjdk:8
```

* [openjdk](https://hub.docker.com/_/openjdk)をベースイメージにする。
* [ドキュメント](https://cwiki.apache.org/confluence/display/HADOOP/Hadoop+Java+Versions)を見ると、Hadoop 3.xだとJava 8しかサポートしていないとのことだったので、`openjdk:8`を使う。

# sshdを起動する
`Required Software`の項目を見ると、Javaの他にsshを必要としている。また、pdshも推奨されている。

```diff
 FROM openjdk:8
+RUN apt-get update \
+  && apt-get install -y --no-install-recommends ssh pdsh \
+  && apt-get clean \
+  && rm -rf /var/lib/apt/lists/*
+RUN mkdir /run/sshd
+CMD ["/usr/sbin/sshd"]
```

* `apt-get`でsshとpdshをインストールする。イメージサイズを減らす工夫もしてある。
* sshdが必要とするディレクトリを作ってからsshdを起動する。

# Hadoopをダウンロードする

```diff
 FROM openjdk:8
 RUN apt-get update \
   && apt-get install -y --no-install-recommends ssh pdsh \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
 RUN mkdir /run/sshd
+RUN wget -q -O - http://ftp.yz.yamagata-u.ac.jp/pub/network/apache/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz | tar zxf -
+ENV PATH=/hadoop-3.2.1/bin:$PATH
 CMD ["/usr/sbin/sshd"]
```

* ミラーサイトからHadoopをダウンロードする。

# スタンドアロンモード
この時点でスタンドアロンモードで動作確認ができる。

```bash
% docker build -t naoty/hello-hadoop .
% docker run --rm -it naoty/hello-hadoop bash
```

ドキュメントに載っているスタンドアロンモードの動作確認をおこなう。

```bash
% cd /hadoop-3.2.1
% mkdir input
% cp etc/hadoop/*.xml input
% bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar grep input output 'dfs[a-z.]+'
% cat output/*
```

# 疑似分散モード

## 設定
疑似分散モードに必要な設定を追加する。設定ファイルをコンテナからローカルにコピーして編集する。

```xml
<!-- config/core-site.xml -->
<configuration>
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://localhost:9000</value>
  </property>
</configuration>
```

```xml
<!-- config/hdfs-site.xml -->
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>1</value>
  </property>
</configuration>
```

```diff
 FROM openjdk:8
 RUN apt-get update \
   && apt-get install -y --no-install-recommends ssh pdsh \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
 RUN mkdir /run/sshd
 RUN wget -q -O - http://ftp.yz.yamagata-u.ac.jp/pub/network/apache/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz | tar zxf -
 ENV PATH=/hadoop-3.2.1/bin:/hadoop-3.2.1/sbin:$PATH
+COPY config /hadoop-3.2.1/etc/hadoop/
 CMD ["/usr/sbin/sshd"]
```

## localhostにsshできるようにする

```diff
 FROM openjdk:8
 RUN apt-get update \
   && apt-get install -y --no-install-recommends ssh pdsh \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
-RUN mkdir /run/sshd
+RUN mkdir /run/sshd \
+  && ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa \
+  && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys \
+  && chmod 0600 ~/.ssh/authorized_keys
 RUN wget -q -O - http://ftp.yz.yamagata-u.ac.jp/pub/network/apache/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz | tar zxf -
 ENV PATH=/hadoop-3.2.1/bin:$PATH
 COPY config /hadoop-3.2.1/etc/hadoop/
 CMD ["/usr/sbin/sshd"]
```

## 動作確認

```bash
% docker build -t naoty/hello-hadoop .
% docker run --rm -it naoty/hello-hadoop bash
```

公式ドキュメントにある通りに疑似分散モードの動作確認をおこなう。

```bash
% /usr/sbin/sshd
% hdfs namenode -format
% start-dfs.sh
Starting namenodes on [localhost]
ERROR: Attempting to operate on hdfs namenode as root
ERROR: but there is no HDFS_NAMENODE_USER defined. Aborting operation.
Starting datanodes
ERROR: Attempting to operate on hdfs datanode as root
ERROR: but there is no HDFS_DATANODE_USER defined. Aborting operation.
Starting secondary namenodes [2ce45712f331]
ERROR: Attempting to operate on hdfs secondarynamenode as root
ERROR: but there is no HDFS_SECONDARYNAMENODE_USER defined. Aborting operation.
```

Hadoopが利用する環境変数を設定するため、コンテナから`hadoop-env.sh`をコピーして環境変数を追加する。

```bash
% docker cp xxxxxxx:/hadoop-3.2.1/etc/hadoop/hadoop-env.sh config/
```

```diff
+export HDFS_NAMENODE_USER=root
+export HDFS_DATANODE_USER=root
+export HDFS_SECONDARYNAMENODE_USER=root
```

もう一回動作確認する。

```bash
% start-dfs.sh
Starting namenodes on [localhost]
ERROR: JAVA_HOME is not set and could not be found.
```

`JAVA_HOME`をOpenJDKのホームディレクトリに設定する。

```diff
+export JAVA_HOME=/usr/local/openjdk-8
```

もう一回動作確認する。

```bash
% start-dfs.sh
Starting namenodes on [localhost]
pdsh@098622af1ce0: localhost: connect: Connection refused
```

[stack overflow](https://stackoverflow.com/questions/48189954/hadoop-start-dfs-sh-connection-refused)によると、pdshを使わなければエラーにならないとのことなので、pdshは削除する。

```diff
 FROM openjdk:8
 RUN apt-get update \
-  && apt-get install -y --no-install-recommends ssh pdsh \
+  && apt-get install -y --no-install-recommends ssh \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
 RUN mkdir /run/sshd
 RUN mkdir /run/sshd \
   && ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa \
   && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys \
   && chmod 0600 ~/.ssh/authorized_keys
 RUN wget -q -O - http://ftp.yz.yamagata-u.ac.jp/pub/network/apache/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz | tar zxf -
 ENV PATH=/hadoop-3.2.1/bin:$PATH
 COPY config /hadoop-3.2.1/etc/hadoop/
 CMD ["/usr/sbin/sshd"]
```

動作確認する。

```bash
% start-dfs.sh
Starting namenodes on [localhost]
Starting datanodes
Starting secondary namenodes [098622af1ce0]
098622af1ce0: Host key verification failed.
```

[stack overflow](https://stackoverflow.com/questions/24524886/error-in-starting-namenode-in-hadoop-2-4-1)によると、`HADOOP_OPTS`に手を加えるとよいとのことだったのでhadoop-env.shを修正する。

```diff
+export HADOOP_OPTS="${HADOOP_OPTS} -XX:-PrintWarnings -Djava.net.preferIPv4Stack=true"
```

動作確認する。

```bash
% start-dfs.sh
Starting namenodes on [localhost]
localhost: Warning: Permanently added 'localhost' (ECDSA) to the list of known hosts.
Starting datanodes
Starting secondary namenodes [1a7271d1d014]
1a7271d1d014: Warning: Permanently added '1a7271d1d014,172.17.0.2' (ECDSA) to the list of known hosts.
```

うまくいった。動作確認を続ける。

```bash
% bin/hdfs dfs -mkdir /user
% bin/hdfs dfs -mkdir /user/root
% bin/hdfs dfs -mkdir input
% bin/hdfs dfs -put etc/hadoop/*.xml input
% bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar grep input output 'dfs[a-z.]+'
% bin/hdfs dfs -cat output/*
```

動作確認ができた。

## 起動スクリプト
Hadoopの起動にはsshdとNameNode, DataNodeの起動が必要になるため、それらを起動するためのスクリプトをつくる。

```bash
#!/bin/bash

/usr/sbin/sshd
start-dfs.sh

# daemonize
while true; do
  sleep 1000
done
```

`start-dfs.sh`はデーモンを起動するだけのスクリプトなので、無限ループを実行してコンテナが終了しないようにしている。

また、NameNodeのフォーマットはビルド時におこなうようにする。

```diff
 FROM openjdk:8
 RUN apt-get update \
   && apt-get install -y --no-install-recommends ssh \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*
 RUN mkdir /run/sshd \
   && ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa \
   && cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys \
   && chmod 0600 ~/.ssh/authorized_keys
 RUN wget -q -O - http://ftp.yz.yamagata-u.ac.jp/pub/network/apache/hadoop/common/hadoop-3.2.1/hadoop-3.2.1.tar.gz | tar zxf -
 ENV PATH=/hadoop-3.2.1/bin:/hadoop-3.2.1/sbin:$PATH
 COPY config /hadoop-3.2.1/etc/hadoop/
+RUN hdfs namenode -format
+COPY start /
-CMD ["/usr/sbin/sshd"]
+CMD ["/start"]
```

```bash
% docker build -t naoty/hello-hadoop .
% docker run --rm -it -p 9870:9870 naoty/hello-hadoop
```

NameNodeは9870番ポートでUIを提供しているのでポートフォワーディングを設定して`localhost:9870`から確認できるようになった。

![](hadoop-ui.png 'localhost:9870')
