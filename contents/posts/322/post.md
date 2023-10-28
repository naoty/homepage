---
title: webpacker用のDockerfile
description: webpackerを導入するときにDockerfileに必要なコマンドをメモしておく
time: 2018-02-12T22:58:00+0900
tags: ["rails", "docker"]
---

webpackerを導入する際にDockerイメージにNode.jsとYarnが必要になるため、以下のようにDockerfileにインストールコマンドを追加する。いつも調べるのが面倒なので、メモしておく。

```docker
FROM ruby:2.5.0

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
  apt-get install -y nodejs

# Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
  apt-get update && \
  apt-get install -y yarn
```

# 参考
* https://nodejs.org/ja/download/package-manager/
* https://yarnpkg.com/ja/docs/install#linux-tab
