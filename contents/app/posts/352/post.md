---
title: Terraformの実行環境
time: 2018-12-02T11:41:00+0900
tags: ["terraform", "docker"]
---

Terraformを実行する方法としては、Homebrew等でインストールしてローカルで実行する方法と、[hashicorp/terraform](https://hub.docker.com/r/hashicorp/terraform/)のDockerイメージを使って実行する方法がある。

# Dockerイメージ

Dockerイメージを使うことで実行するTerraformのバージョンをチームで統一することができる。また、CIでTerraformを簡単に実行できるようになるので、Dockerイメージを使うようにしている。

[hashicorp/terraform](https://hub.docker.com/r/hashicorp/terraform/)を使うときにはベースイメージとして使い、ソースコードを`ADD`したDockerイメージを作っている。`ENTRYPOINT`が`terraform`に設定されているため、以下のようにしてデフォルトでシェルにログインできるようにしている。

```docker
FROM hashicorp/terraform:0.11.10
WORKDIR /terraform
ADD . /terraform/
ENTRYPOINT [""]
CMD ["/bin/sh"]
```

`CMD`では`/bin/sh`の前に`terraform init`をしておくようなスクリプトを使うとより便利になると思う。

# 複数環境

本番環境やステージング環境といった環境ごとにtfstateを管理し環境間で共用するモジュールがある場合、以下のようなディレクトリ構成になると思う。

```
.
├── modules
│   └── some_module
├── production
│   ├── main.tf
│   └── terraform.tfstate
└── staging
    ├── main.tf
    └── terraform.tfstate
```

こういった場合、環境ごとにDockerfileを用意するようにしている。

```docker
FROM hashicorp/terraform:0.11.10
WORKDIR /terraform/production

ADD ./production /terraform/production
ADD ./modules /terraform/modules
RUN terraform get

ENTRYPOINT [""]
CMD ["/bin/sh"]
```

モジュールを利用するため`terraform get`でモジュールを初期化した状態でDockerイメージをビルドする。ビルドする際には以下のようにDockerfileの場所とコンテキストを分けて指定する。

```
$ docker build -t my-terraform:production -f ./production/Dockerfile .
```

環境ごとにDockerfileを用意する場合、docker-composeを使うとより簡単に管理できる。

```yaml
version: "3"
services:
  production:
    build:
      context: .
      dockerfile: ./production/Dockerfile
    image: my-terraform:production
    volumes:
      - ./production:/terraform/production
      - ./modules:/terraform/modules
  staging:
    build:
      context: .
      dockerfile: ./staging/Dockerfile
    image: my-terraform:staging
    volumes:
      - ./staging:/terraform/staging
      - ./modules:/terraform/modules
```

これですべての環境のDockerイメージを簡単にビルドできる。

```
$ docker-compose build
```

Terraformを実行するときは環境を指定してDockerイメージを起動すればいい。

```
$ docker-compose run --rm production
```
