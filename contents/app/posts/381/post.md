---
title: ステータスコードをログに出力するhttp.Handler
time: 2019-09-07T12:05:00+0900
tags: ["go"]
---

`http`パッケージだけでWebアプリケーションを書くとき、アクセスログの出力も`http.Handler`で実装しようとするけど、ステータスコードを取得する手段がないことに気づく。

そこで`http.ResponseWriter`を独自に実装することで解決できたのでメモに残す。

```go
type logger struct {
  logger *log.Logger
  handler *http.Handler
}

func (l *logger) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  lw := &loggingResponseWriter{
    ResponseWriter: w,
    statusCode: http.StatusOK,
  }
  l.handler.ServeHTTP(lw, r)
  log.Printf("status:%d path:%s\n", lw.statusCode, r.URL.Path)
}

type loggingResponseWriter struct {
  http.ResponseWriter
  statusCode int
}

func (w *loggingResponseWriter) WriteHeader(statusCode int) {
  w.statusCode = statusCode
  w.ResponseWriter.WriteHeader(statusCode)
}
```

* `logger`という`http.Handler`は他の`http.Handler`をラップするミドルウェアになっている。`ServeHTTP`でラップした`http.Handler`の`ServeHTTP`を呼んだ後で、ログを出力している。
* `loggingResponseWriter`という独自の`http.ResponseWriter`を用意する。埋め込みによってinterfaceを実装している。
* `loggingResponseWriter`は`WriteHeader`だけ独自に実装し、受け取ったステータスコードを保持するようにしている。こうすることで後でログに出力できる。それ以外のメソッドは埋め込んだ`http.ResponseWriter`に委譲される。
