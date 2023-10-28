---
title: goroutineの実行パターン
time: 2019-09-01T18:43:00+0900
tags: ["go"]
---

最近、[Go言語による並行処理](https://www.oreilly.co.jp/books/9784873118468/)を読んでいる。その中で明示的には紹介されていないものの、頻繁に登場するコードを整理して理解したい。

以下のコード例では、goroutineを実行してその結果を受信するchannelを取得できる関数を定義している。

```go
// goroutineの結果を表す型
type result struct {
  value int
  err   error
}

generate := func() <-chan result {
  // 送受信可能なchannelを生成する
  ch := make(chan result)

  // channelに結果を送信するgoroutineを実行する
  go func() {
    // channelを確実に終了させる
    defer close(ch)

    err := something()
    if err != nil {
      ch <- result{value: -1, err: err}
      return
    }

    ch <- result{value: 1, err: nil}
  }()

  // 返り値の型が<-chanなので受信専用のchannelとして返る
  return ch
}
```

* 関数の返り値が`<-chan result`になっているため、この関数を呼び出す側はこのchannelから値を受信することしかできない。
* goroutine内で`defer`によって確実にchannelを終了させる。
* goroutineの結果を表す型を定義して`error`を含めた値をchannelに送ることで、呼び出す側でエラーハンドリングできるようにしている。
