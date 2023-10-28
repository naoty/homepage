---
title: bin/webpackに必要最小限のファイル
time: 2018-03-13T21:22:00+0900
tags: ["rails", "docker"]
---

[前回](https://naoty.github.io/posts/23.html)と同様にwebpackerによるbundleに必要最小限なファイルの`COPY`を試してみた。

```docker
FROM starefossen/ruby-node:2-8-alpine
WORKDIR /myapp

COPY app/javascript /myapp/app/javascript/
COPY bin/webpack /myapp/bin/
COPY config/webpack /myapp/config/webpack/
COPY config/webpacker.yml /myapp/config/webpacker.yml
COPY .babelrc .postcssrc.yml /myapp/
COPY Gemfile Gemfile.lock /myapp/
COPY --from=bundler /usr/local/bundle /usr/local/bundle
RUN bin/webpack
```

* webpackerを使うにはRubyとNodeの両方が必要になるため両方が入ったベースイメージを探したところ、[starefossen/ruby-node](https://hub.docker.com/r/starefossen/ruby-node/)がよさそうだった。
* `COPY --from=bundler`としているところは、[multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/)を使っている。前段のビルドで`bundle install`しておいたものを`COPY`している。こうすることで実行時には不要なものを除くことができる。このビルド自体もRailsを起動するために必要なファイルを生成するビルドにすぎない。
