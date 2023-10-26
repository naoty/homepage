---
title: multi-stage buildでのfreshの運用
time: 2018-08-05T18:55:00+0900
tags: ["go", "docker"]
---

Goで書いているWebアプリケーションをDockerイメージにするとき、multi-stage buildを使ってビルド用のイメージと実行用のイメージを分けると思う。実行用のイメージをalpine linuxベースにするとイメージのサイズが異常に小さくなる。

```docker
FROM golang as builder
ENV CGO_ENABLED 0
WORKDIR /go/src/github.com/naoty/hello

RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh \
  && go get github.com/pilu/fresh

# dep
COPY Gopkg.toml Gopkg.lock /go/src/github.com/naoty/hello/
RUN dep ensure -v --vendor-only=true

COPY . /go/src/github.com/naoty/hello/
RUN make install

FROM alpine
RUN apk --no-cache add ca-certificates 
WORKDIR /root/
COPY --from=builder /go/bin/hello /root/
CMD ["./hello"]
```

一方で、Goの開発では[pilu/fresh](https://github.com/pilu/fresh)を使ってファイルの更新時に自動的にビルドと実行をし直したい。だけど、multi-stage buildを使っていると、実行用のイメージにはGoのビルド環境がないため、少し工夫が必要になる。

docker-composeを使うとき、`target`オプションを使うとビルド用のコンテナまででビルドを中断できる。ただし、3.4からの機能なので`version`を3.4以上にする必要がある。

```yaml
version: "3.4"
services:
  app:
    build:
      context: .
      target: builder
    command: ["fresh"]
```
