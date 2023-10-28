---
title: ErrorとFatalの使い方
time: 2020-05-02 12:56
tags: ["go"]
---

testingパッケージの使い方を時間をとって調べたことがなかったので、あらためてちゃんと調べてみる。testingパッケージの中にもいろいろあるけど特に`testing.T`型について調べてみた。

[Godoc](https://golang.org/pkg/testing/#T)を読んでみると、あることがわかった。

* `Error`/`Errorf`: `Fail`してから`Log`/`Logf`する
* `Fatal`/`Fatalf`: `FailNow`してから`Log`/`Logf`する

なので、`Fail`と`FailNow`と`Log`がわかっていれば基本的なことを理解できそう。

* `Fail`は実行中の関数を失敗とマークするけど、停止させずに継続する。
* `FailNow`は実行中の関数を失敗とマークして、`runtime.Goexit`関数で停止させる。ちなみに、`runtime.Goexit`は`os.Exit`と違って`defer`関数を呼び出してから現在のgoroutineを終了させる。
* `Log`はテストが失敗したときだけテキストを出力する。

ということで、テストが失敗して即座に終了したい場合（エラーが出たときなど）は`Fatal`、テストが失敗したけど後続するテストも行いたい場合は`Error`を使えばいいことがわかった。
