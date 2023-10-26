---
title: ストリームを利用したローパスフィルタの実装
time: 2014-10-01 00:07
tags: ['ios']
---

![f:id:naoty_k:20140930233211p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20140930/20140930233211.png "f:id:naoty\_k:20140930233211p:plain")

このスクリーンショットに映された2つの線は共にiPhoneの加速度センサーの値を表しており、下の緑が加工していない生データ、上の青い線がローパスフィルタという仕組みで揺れを除去したデータだ。

[以前の記事](http://naoty.hatenablog.com/entry/2014/08/31/000115)でSwiftを使ったストリームの実装をしてみたのだけど、その使いどころを考えてみたところセンサーデータの加工にストリームという概念が適しているのではないかと思いついた。センサーから送られてくるデータは連続的で、その加工には複雑な計算を要するためだ。

そこで、加速度センサーをグラフに表示する簡単なアプリを作ってみて、生データとストリームを使って加工したデータを視覚的に表現してみることにした。その結果が上のスクリーンショットとなる。今回はローパスフィルタと呼ばれる手法を用いて生データを加工した。そちらの方面にはまるっきり分からないのだけど、以下のようなとてもシンプルなアルゴリズムでデータを加工できるとのことだったので利用した。

```
今回の加工したデータ = 前回の加工したデータ * 0.9 + 今回の生データ * 0.1
```

このローパスフィルタを以前開発した[ストリームライブラリ](https://github.com/naoty/Stream)で実装してみる。

```
var x: [CGFloat] = []
var filteredX: [CGFloat] = []

let xStream = Stream<CGFloat>()
```

まず、生データと加工したデータをグラフに描画するための配列と生データを扱うストリームを用意する。加速度センサーから値を取得する度にこのストリームに値を出力していく。

```
override func viewDidLoad() {
    // ...

    motionManager.startAccelerometerUpdatesToQueue(NSOperationQueue.currentQueue(), withHandler: accelerometerHandler)
}

private func accelerometerHandler(data: CMAccelerometerData!, error: NSError!) {
    xStream.publish(CGFloat(data.acceleration.x))
}
```

ストリームに渡された生データをグラフに描画するための配列に入れるため、値が出力されたときに実行される関数を登録しておく。これで生データが出力されたときはいつでもこの関数が実行される。

```
override func viewDidLoad() {
    // ...

    xStream.subscribe { [unowned self] message in self.x.append(message) }
}
```

続いて、上のストリームに出力された生データを加工して出力する別のストリームを作成する。これは`scan`関数を利用することで簡単に実現できる。`scan`関数は「前回出力された値と今回出力された値を使って、新たな値を出力するストリーム」を簡単に作成できる。なので、上で示したローパスフィルタのアルゴリズムを以下のように実装することができる。

```
override func viewDidLoad() {
    // ...

    xStream.subscribe { [unowned self] message in self.x.append(message) }

    let filteredStream: Stream<CGFloat> = xStream.scan(0) { previousMessage, message in
        return previousMessage * 0.9 + message * 0.1
    }
}
```

最後に、加工した値の出力を見張ってグラフ描画用の配列に追加するための関数を登録しておく。

```
override func viewDidLoad() {
    // ...

    xStream.subscribe { [unowned self] message in self.x.append(message) }

    let filteredStream: Stream<CGFloat> = xStream.scan(0) { previousMessage, message in
        return previousMessage * 0.9 + message * 0.1
    }.subscribe { [unowned self] message in
        self.filteredX.append(message)
        // ...
    }
}
```

このように、ストリームの性質やストリームを扱う様々な関数を利用すると、簡単にセンサーデータを扱うプログラムを実装することができた。アプリのソースコードは[github](https://github.com/naoty/LowpassStreamSample)にアップしてあるので、参考にしてほしい。
