---
title: docker-composeでwebpack-dev-serverを使う
description: docker-composeでwebpack-dev-serverを起動しRails + webpackerからアクセスできるようにした話
time: 2018-06-06T23:04:00+0900
tags: ["docker"]
---

docker-composeを使って開発をしているとき、webpack-dev-serverを別サービスとして起動させたくなる。Rails + webpackerの環境でうまく実現できたのでメモを残しておく。

`docker-compose.yml`のうちポイントとなる箇所だけ抽出した。

```yaml
services:
  rails:
    environment:
      WEBPACKER_DEV_SERVER_HOST: webpack-dev-server
    volumes:
      - ./public/packs:/myapp/public/packs
    depends_on:
      - webpack-dev-server
  webpack-dev-server:
    environment:
      WEBPACKER_DEV_SERVER_HOST: 0.0.0.0
    ports:
      - 3035:3035
    volumes:
      - ./public/packs:/myapp/public/packs
```

# webpackerとwebpack-dev-server
webpackerをセットアップするとwebpack-dev-serverもついてくる。そして、`config/webpacker.yml`にはwebpack-dev-serverの設定も含まれている。

開発環境において、webpackerはアセットへのリクエスト受信時にwebpackを実行してアセットをコンパイルするが、webpack-dev-serverの起動が確認できればアセットへのリクエストをwebpack-dev-serverに転送するようになっている。

Railsがwebpack-dev-serverに接続する際、`config/webpacker.yml`に記載されたhostとportを参照する。ただし、`WEBPACKER_DEV_SERVER_*`のようなパターンの環境変数を設定することでYAMLファイルの設定を上書きできるようになっており、それを利用しているのが、上の`docker-compose.yml`内で指定している環境変数`WEBPACKER_DEV_SERVER_HOST`となる。これでwebpack-dev-serverのhostを設定できる。

このdocker-composeでは、`depends_on`で設定したサービスのaliasを設定することでRailsからwebpack-dev-serverにアクセスできるようにしている。また、`webpack-dev-server`サービスで`0.0.0.0`を指定しているのは、このコンテナ外からアクセスできるようにするためだ。

# マニフェストファイルの共有
Railsがwebpackでコンパイルしたアセットにアクセスする際、マニフェストファイルに記載されたアセットのファイルパスを利用している。マニフェストファイルはコンパイル時に生成されるため、webpack-dev-serverを実行するコンテナでマニフェストファイルが生成されることになる。

そこで、マニフェストファイルが生成される`public/packs`ディレクトリをホストとマウントすることでRailsコンテナからマニフェストファイルを参照できるようにしている。

# live reload
webpack-dev-serverはアセットのソースコードが変更されたときにブラウザを自動更新させるlive reloadの機能も備えている。live reloadはwebpack-dev-serverがアセットをコンパイルする際にlive reloadするスクリプトを挿入することで実現している（はず）。そのスクリプトはwebpack-dev-serverを参照するため（ここら辺の詳しい仕組みはちゃんと把握できていない）、3025番でホストとのポートマッピングを行っている。
