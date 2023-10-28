---
title: GoのためのDockerfile
time: 2017-09-18 12:18
tags: ['go', 'docker']
---

## base image

`library/golang`で公式イメージが用意されている。ユースケースに合わせていくつかの種類が用意されている。

- `golang:<version>`: 何が必要なのか分かっていない場合はこれを使った方がよさそう。
- `golang:alpine`: Alpine Linuxをベースとしているため非常に軽い。イメージサイズを小さくしたい場合に推奨されている。
- `golang:onbuild`: ネット上ではよく紹介されているが、公式では非推奨とされている。

## ディレクトリレイアウト

```
$ docker run -i -t --rm golang:1.9 /bin/bash
root@xxxxxxxxx:/go# pwd
/go
root@xxxxxxxxx:/go# ls
bin src
root@xxxxxxxxx:/go# env | grep GO
GOLANG_VERSION=1.9
GOPATH=/go
```

`GOPATH`が`/go`に設定されているので、`/go/src/`以下に`WORKDIR`を設定していく。

## Dockerfile

```
FROM golang:1.9
WORKDIR /go/src/github.com/naoty/golang-sample
COPY . .
RUN go install github.com/naoty/golang-sample
ENTRYPOINT ["golang-sample"]
```

`go install ...`で`/go/bin/`以下にバイナリがビルドされる。`PATH`は`/go/bin`も含まれているため、そのままビルドされたバイナリを指定するだけでOK。

## 参考

- [Dockerfile のベストプラクティス — Docker-docs-ja 1.9.0b ドキュメント](http://docs.docker.jp/engine/articles/dockerfile_best-practice.html)
- [https://hub.docker.com/\_/golang/](https://hub.docker.com/_/golang/)
