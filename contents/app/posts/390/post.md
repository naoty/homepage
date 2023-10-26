---
title: セキュアなDockerfileを書く
time: 2019-12-07 18:30
tags: ["docker", "security"]
---

最近コンテナのセキュリティへの意識が高まっているので、まずはセキュアなイメージのためのDockerfileを書く方法を調べる。

# Before
Rails 6.0.1を動かすためのDockerfileを書いてみた。webpackerを動かすためにNode.jsやYarnも入れている。

```dockerfile
FROM node:12.13.1 AS node
FROM ruby:2.6.5

RUN apt-get update

# node
COPY --from=node /usr/local/bin/node /usr/local/bin/

# yarn
COPY --from=node /opt/yarn-v1.19.1 /opt/yarn-v1.19.1/
RUN ln -s /opt/yarn-v1.19.1/bin/yarn /usr/local/bin/yarn && \
  ln -s /opt/yarn-v1.19.1/bin/yarnpkg /usr/local/bin/yarnpkg

WORKDIR /hello-rails

# npm packages
COPY package.json yarn.lock /hello-rails/
RUN yarn install

# rubygems
COPY Gemfile Gemfile.lock /hello-rails/
RUN bundle install

COPY . /hello-rails/

ENTRYPOINT ["bin/rails"]
CMD ["s"]
```

[trivy](https://github.com/aquasecurity/trivy)を使って脆弱性を調べてみると、思っていた以上に脆弱性が見つかった。

```
$ trivy naoty/rails
naoty/rails:latest (debian 10.2)
================================
Total: 1399 (UNKNOWN: 16, LOW: 92, MEDIUM: 1137, HIGH: 143, CRITICAL: 11)
```

# ベースイメージを最小限にする
必要最小限のツールだけを含めて攻撃の対象になる脆弱性を減らしたい。そこで、alpineベースのベースイメージに変更する。

```diff
-FROM node:12.13.1 AS node
-FROM ruby:2.6.5
+FROM node:12.13.1-alpine AS node
+FROM ruby:2.6.5-alpine

-RUN apt-get update
+RUN apk update && \
+  apk add --no-cache build-base sqlite-dev
```

trivyでもう一度脆弱性を調べてみると、脆弱性はほとんどなくなった。

```
$ trivy naoty/rails:alpine
naoty/rails:alpine (alpine 3.10.3)
==================================
Total: 1 (UNKNOWN: 0, LOW: 0, MEDIUM: 1, HIGH: 0, CRITICAL: 0)
```

# rootをなるべく使わない
`root`ユーザーではなく最小限の権限しかもたないユーザーを使う。コンテナに侵入された場合の被害を最小限に抑えられる。

```diff
 COPY . /hello-rails/

+RUN addgroup -S ruby && \
+  adduser -S ruby ruby && \
+  chown -R ruby:ruby /hello-rails
+USER ruby

 ENTRYPOINT ["bin/rails"]
 CMD ["s"]
```

* Alpineでは`groupadd`, `useradd`ではなく`addgroup`, `adduser`を使う。
* `-S`オプションを使ってシステムユーザーを作成する。システムユーザーはパスワードをもたずログインシェルもないので、より安全なユーザーとして使える。
* 作成したユーザーを`USER`で指定してrailsを起動するようにしている。

# 参考
* https://snyk.io/blog/10-docker-image-security-best-practices/
