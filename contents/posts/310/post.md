---
title: Circle CI 2.0への移行作業
time: 2017-12-12T22:35:00+0900
description: RailsプロジェクトをCircle CI 2.0に移行した
tags: ["circleci"]
---
最近、RailsプロジェクトをCircle CI 2.0へ移行した。「テスト→Dockerイメージのビルド→レジストリへのPush」というワークフローを作った。

```yml
workflows:
  version: 2
  build:
    jobs:
      - test
      - build-image:
          requires:
            - test
      - push-image:
          requires:
            - build-image
```

# テスト
テストでは、Circle CIのイメージを使うか、テスト前にDockerイメージをビルドしてそれをテストに使うか、というところで迷った。

前者の場合、`circleci/ruby:2.4.2`のようなイメージを利用する。メリットとしては、テストが通ったコードのみDockerイメージをビルドするため、失敗した場合により速く完了する。僕のプロジェクトでは、Dockerイメージのビルドが最も時間がかかるため、この方法を採った。

後者の場合、上記のようなワークフローの順番を入れ替えて、ビルドしたDockerイメージを`docker save`で永続化し、テスト前に`docker load`で再利用するような形になりそう。メリットとしては、開発環境とテスト環境（そして理想的には本番環境）をすべて揃えることができる。Dockerイメージのポータビリティを活かした方法だと思う。一方で、上記の通りDockerイメージのビルドに時間がかかる場合にワークフロー全体の完了に時間がかかってしまう。

# Dockerイメージのビルド
Dockerイメージのビルドは最も時間がかかる部分だった。Dockerイメージのビルドはどの環境で行うのがベターなのかベストプラクティスが分からなかった。GCRにpushする都合で、`google/cloud-sdk`をDockerイメージとして使い、コンテナ上でDockerイメージをビルドすることになった。

Circle CI 2.0では、`setup_remote_docker`というコマンドを使うことでコンテナと別の環境にDockerデーモンを起動しDockerイメージのビルドを行うことができる（[参考](https://circleci.com/docs/2.0/building-docker-images/)）。課金してサポートに連絡すれば、過去のビルドで利用したレイヤーをキャッシュして再利用することができる。これを有効にできると、Dockerイメージのビルドを超高速化できそう。

# レジストリへのPush
僕のプロジェクトでは、GCRにビルドしたDockerイメージをPushしている。先述の通り、これを簡単に行うために`google/cloud-sdk`のDockerイメージを利用している。GCRを使う場合の[ドキュメント](https://circleci.com/docs/2.0/google-container-engine/)を参考に設定をし、無事に移行できた。
