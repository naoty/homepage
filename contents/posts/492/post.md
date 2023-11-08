---
title: minikubeでRailsアプリを動かす
time: 2022-10-23 11:18
tags: ['kubernetes', 'rails']
---

仕事でkubernetesを使うようになりそうだったので、minikubeでRailsアプリを動かしてkubernetesに馴染んでいきたい。これはRailsアプリが動くまでにおこなったことのメモだ。

# minikubeのセットアップ
minikubeはmacOSやWindowsなどでローカルにkubernetesクラスターを立ち上げるツール。このクラスターはノードを1つしか持たず、VMを利用して立ち上げる。今回はDocker for Macが管理するVMを使う。

minikubeはHomebrewでインストールできる。そして、`minikube start`によってVMを起動し、その中にクラスターに必要なPodをいくつか立ち上げる。

```
% brew install minikube
% minikube start
```

# Railsアプリを用意する
`rails new`してプロジェクトを作り、Dockerfileを用意しておく。あと、今回はMySQLもkubernetesで立ち上げ、クラスター内でRailsアプリと接続できるようにしたいので、database.ymlで環境変数からホスト等を設定できるようにしておく。

イメージをビルドする際、docker CLIが接続するdockerデーモンをminikubeが管理するものに向ける必要がある。`minikube docker-env`を使うと、そのために必要な環境変数を出力してくれるので、これを`direnv`などを使い環境変数にセットする。

```
% minikube docker-env
export DOCKER_TLS_VERIFY="1"
# ...
```

# RailsアプリのService
Serviceとは、Deploymentによって立ち上がったPodを他のPodや外部からトラフィックを受けれるようにするやつ。Serviceには何種類かタイプがあるが、今回はRailsアプリを外部と接続できるようにしたいので、NodePortと呼ばれるタイプを使う。

```yaml
# kubernetes.yaml
apiVersion: v1
kind: Service
metadata:
  name: rails-service
spec:
  type: NodePort
  selector:
    app: rails
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
```

こういう設定ファイルをYAMLに書く。この設定の意味としては、

* `selector`で指定したキーとバリューをラベルとしてもつPodを対象に、Serviceはトラフィックを転送する。
* `port`のポート番号はクラスター内の他のPodからアクセスする際に、クラスターIPと一緒に指定して使う。クラスターIPというのはクラスター内でのみ有効なIPアドレスのこと。
* `targetPort`のポート番号にServiceからトラフィックが転送される。今回はRailsアプリが使う3000にしてある。

`kubectl apply`コマンドでServiceを作成する。

```
% kubectl apply -f kubernetes.yaml
```

`NodePort`で作成したので、クラスター内のすべてのノード、つまりminikubeが管理するVMの`3000`番ポートへのトラフィックがRailsアプリのPodに転送されるようになった。

# RailsアプリのDeployment
Deploymentとは、Podのデプロイやオートヒーリング（起動すべきPod数を維持すること）などをやってくれるやつ。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rails-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rails
  template:
    metadata:
      labels:
        app: rails
    spec:
      containers:
        - name: rails
          image: hello-kubernetes/rails:58da317
          ports:
            - containerPort: 3000
```

* `replicas`で起動するPodの数を指定する。DeploymentはPodが異常終了してもこの数を維持するように自動的にPodを起動してくれる。
* `labels`で`app=rails`というラベルをつけることで、先ほど作ったServiceがこのPodにトラフィックを転送するようになる。
* `image`で指定するイメージは先述したminikubeが管理しているdockerデーモンに登録されている必要がある。

# Secret
RailsアプリからMySQLに接続する際にusernameやpasswordを環境変数で指定することになる。ただし、機密情報なので設定ファイルに平文でパスワードなどを保存したくない。そういったケースでSecretを使う。

今回はファイルに保存せず`kubectl`でSecretを作成する。作成方法にはいくつかあるが、以下のような.envを使ってみる。

```
username=root
password=password
```

```
% kubectl create secret generic \
  --save-config mysql-credentials \
  --from-env-file=.env
```

これで.envの中身をSecretとして保存できた。

# MySQLのService
次にRailsアプリから接続するMySQLもkubernetesで管理する。Railsアプリのときとは異なり、MySQLのPodはクラスター内だけで接続できるようにしたいので、`NodePort`ではなく`ClusterIP`を指定する。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
spec:
  type: ClusterIP
  selector:
    app: mysql
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
```

# MySQLのDeployment
Railsアプリとほとんど同じだけど、`env`以下で`mysql-credentials`というSecretの`password`というキーの値を環境変数にセットしている。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-credentials
                  key: password
```

# RailsのPodにも環境変数を追加
MySQLのパスワードとホスト名をRailsのPodに渡すためにDeploymentで環境変数に指定する。ここでMySQLのPodのIPアドレスはServiceが提供するDNSによってService名より名前解決できる。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rails-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rails
  template:
    metadata:
      labels:
        app: rails
    spec:
      containers:
        - name: rails
          image: hello-kubernetes/rails:58da317
          ports:
            - containerPort: 3000
          env:
            - name: MYSQL_HOST
              value: mysql-service
            - name: MYSQL_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-credentials
                  key: password
```

# macとVMの間のトンネリング
ここまででVMとRailsアプリの間、RailsアプリとMySQLの間では通信できるようにになったものの、まだmacとVMの間で通信できるようになっていないので、ブラウザからRailsアプリにアクセスできない。

`minikube service`コマンドを使うと、トラフィックを指定したServiceに転送するトンネルをmac上に起動する。

```
% minikube service rails-service
```

おおざっぱな図で整理するとこんな感じで各コンポーネントが接続していて、ブラウザからRailsアプリにアクセスできるようになっている。正確には、VM上のネットワーク、kubernetesクラスターのネットワークは別なので、この図だと微妙なのだけど、まぁこんな感じ。

![ネットワーク](/posts/492/network.png)
