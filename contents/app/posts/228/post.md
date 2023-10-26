---
title: PromiseKit/swiftを読んだ
time: 2014-08-13 02:12
tags: ['swift']
---

# PromiseKitとは

- [http://promisekit.org/](http://promisekit.org/)
- iOSプログラミングで頻繁に出てくる非同期処理を簡単かつエレガントにするライブラリ。
- JavaScriptとかでおなじみのPromiseパターンの実装と、各種CocoaフレームワークからPromiseを使うための拡張が含まれている。
- Objective-C版とSwift版がある。

# 使い方

```
NSURLConnection.GET("http://placekitten.com/250/250").then{ (img:UIImage) in
    // ...
    return CLGeocoder.geocode(addressString:"Mount Rushmore")
}.then { (placemark:CLPlacemark) in
    // ...
    return MKMapSnapshotter(options:opts).promise()
}.then { (snapshot:MKMapSnapshot) -> Promise<Int> in
    // ...
    let av = UIAlertView()
    // ...
    return av.promise()
}.then {
    self.title = "You tapped button #\($0)"
}.then {
    return CLLocationManager.promise()
}.catch { _ -> CLLocation in
    return CLLocation(latitude: 41.89, longitude: -87.63)
}.then { (ll:CLLocation) -> Promise<NSDictionary> in
    // ...
}.then
// ...
```

- `then`や`catch`にクロージャを渡してメソッドチェーンしていく。これは普通のPromiseパターンと同じ。
- エラーが発生したら最も近い`catch`で補足される。

* * *

# tl;dr

- `NSURLConnection+PromiseKit.swift`のようなextensionが何種類か用意されている。
  - 拡張されたメソッドは非同期処理を開始し、Promiseオブジェクトを初期化してすぐに返す。
  - 非同期処理が成功すると、`fulfiller`メソッドが実行される。
- `fulfiller`メソッドは以下を実行する。
  - Promiseオブジェクトの`status`を`.Fulfilled`に更新する。
  - `handlers`にあるクロージャをすべて実行する。
- Promiseオブジェクトの`then`メソッドを呼ぶと以下のようなクロージャが`handlers`に追加され、新しいPromiseオブジェクトを返す。
  - `then`メソッドの引数のクロージャを実行する。
  - その返り値を`fulfiller`に渡して実行する。

* * *

# NSURLConnection+Promise.swift

```
public class func GET(url:String) -> Promise<NSData> {
    // ...
}
```

- いくつかの拡張を見てみるとすべて`Promise<T>`を返すようになってる。
- この返り値に対して`then`や`catch`を呼んでいるので、これらのメソッドは`Promise`クラスのメソッドだと考えられる。`Promise`クラスについてはあとで見ていく。

```
public class func GET(url:String) -> Promise<UIImage> {
    let rq = NSURLRequest(URL:NSURL(string:url))
    return promise(rq)
}
```

- 冒頭の使い方のところで出てきた`UIImage`を扱うメソッドはこれ。
- `NSURLRequest`オブジェクトを作って`promise`メソッドというのに渡して呼んでいる。

```
public class func promise(rq:NSURLRequest) -> Promise<UIImage> {
    return fetch(rq) { (fulfiller, rejecter, data) in
        // ...
    }
}
```

- 引数に渡した`NSURLRequest`オブジェクトを`fetch`メソッドに渡して呼び出している。
- `fetch`メソッドはさらにクロージャを受け取っている。

```
func fetch<T>(var request: NSURLRequest, body: ((T) -> Void, (NSError) -> Void, NSData) -> Void) -> Promise<T> {
    // ...

    return Promise<T> { (fulfiller, rejunker) in
        // ...
    }
}
```

- `fetch`内では`Promise<T>`を初期化して返している。初期化時にまたもクロージャを渡している。

```
// Promise.swift

public init(_ body:(fulfiller:(T) -> Void, rejecter:(NSError) -> Void) -> Void) {
    // ...
    body(fulfiller, rejecter)
}
```

- 上のようなクロージャを受け取る初期化はこれのようだ。
- まず`body`という引数を受け取る。`body`は`fulfiller`と`rejecter`の2つのクロージャを受け取って`Void`を返すクロージャ（ややこしい…）である。
- この`init`では引数として受け取った`body`というクロージャを実行している。`body`に渡される2つの引数は`init`内で定義される内部メソッドである。

```
// Promise.swift

public init(_ body:(fulfiller:(T) -> Void, rejecter:(NSError) -> Void) -> Void) {
    func recurse() {
        for handler in handlers { handler() }
        handlers.removeAll(keepCapacity: false)
    }
    func rejecter(err: NSError) {
        if self.pending {
            self.state = .Rejected(err)
            recurse()
        }
    }
    func fulfiller(obj: T) {
        if self.pending {
            self.state = .Fulfilled(obj)
            recurse()
        }
    }

    body(fulfiller, rejecter)
}
```

- `fulfiller`メソッドは`state`を`.Fulfilled`に変更し`recurse`を呼ぶ。
- `rejecter`メソッドは`state`を`.Rejected`に変更し`recurse`を呼ぶ。
- `recurse`メソッドは、すべての`handler`を実行したあと消去している。

```
func fetch<T>(var request: NSURLRequest, body: ((T) -> Void, (NSError) -> Void, NSData) -> Void) -> Promise<T> {
    // ...

    return Promise<T> { (fulfiller, rejunker) in
        NSURLConnection.sendAsynchronousRequest(request, queue:PMKOperationQueue) { (rsp, data, err) in
            // ...

            if err {
                rejecter(err)
            } else {
                body(fulfiller, rejecter, data!)
            }
        }
    }
}
```

- `Promise<T>`の初期化時に引数として渡されたクロージャが実行されるので、このときに非同期通信が実行されるようだ。
- 非同期通信が成功した場合、`body(fulfiller, rejecter, data!)`が呼ばれる。この`body`というクロージャは`fetch`メソッドに渡されたもので、その中の`fulfiller`と`rejecter`の2つのクロージャは`Promise<T>`の`init`内で定義されたメソッドである。

# Promise.swift

```
public func then<U>(onQueue q:dispatch_queue_t = dispatch_get_main_queue(), body:(T) -> U) -> Promise<U> {
}
```

- シグネチャーがジェネリクスまみれで複雑。`dispatch_queue_t`型と`(T) -> U`型を引数にとり、`Promise<U>`型を返すメソッドということになる。
- `T`はPromiseクラスの型変数（←言い方合ってる？）であり、`NSURLConnection+Promise.swift`の例で言うと、この`T`には`NSData`や`NSString`が入ってくる。
- 例えば`T`が`NSData`の場合、第2引数のbodyは「NSDataを引数にとって`U`を返すクロージャ」となる。この`U`が例えば`MKPlacemark`である場合、`then`は`Promise<MKPlacemark>`を返すことになる。
- この返り値は`Promise<T>`であるため再度`then`を呼び出すことができメソッドチェーンが成立している。

```
public func then<U>(onQueue q:dispatch_queue_t = dispatch_get_main_queue(), body:(T) -> U) -> Promise<U> {
    switch state {
    case .Rejected(let error):
        // ...
    case .Fulfilled(let value):
        // ...
    case .Pending:
        // ...
    }
}
```

- `state`は`Promise<T>`クラスのプロパティで`State<T>`型として定義されている。

```
enum State<T> {
    case Pending
    case Fulfilled(@autoclosure () -> T)
    case Rejected(NSError)
}
```

- `Fulfilled`は引数に`() -> T`型のクロージャをとる。`@autoclosure`は指定された引数を暗黙的にクロージャとして扱えるようにする。これによって引数を`{ ... }`で囲う必要がなくなる。cf) [https://developer.apple.com/swift/blog/?id=4](https://developer.apple.com/swift/blog/?id=4)

```
public func then<U>(onQueue q:dispatch_queue_t = dispatch_get_main_queue(), body:(T) -> U) -> Promise<U> {
    switch state {
    case .Rejected(let error):
        // ...
    case .Fulfilled(let value):
        // ...
    case .Pending:
        // ...
    }
}
```

- `state`はenum型であることが分かったので、`then`に戻る。
- このswitch文ではvalue bindingsを行っている。マッチしたcase文で宣言された変数に値が割り当てられる。例えば、.Fulfilledにマッチした場合、stateを初期化する際に.Fulfilledに渡されたクロージャが`value`という変数に割り当てられる。

```
public func then<U>(onQueue q:dispatch_queue_t = dispatch_get_main_queue(), body:(T) -> U) -> Promise<U> {
    switch state {
    // ...
    case .Pending:
        return Promise<U>{ (fulfiller, rejecter) in
            // ...
        }
    }
}
```

- `status`は宣言時に初期値として`.Pending`を渡しているため、最初は`.Pending`のcase文を通ることになりそう。
- `status`が`.Pending`である場合、`Promise<U>`を初期化して返している。
- 初期化の際、引数にクロージャを渡している。上述の通り、渡されたクロージャは初期化処理の最後に実行される。

```
public func then<U>(onQueue q:dispatch_queue_t = dispatch_get_main_queue(), body:(T) -> U) -> Promise<U> {
    switch state {
    // ...
    case .Pending:
        return Promise<U>{ (fulfiller, rejecter) in
            self.handlers.append{
                switch self.state {
                case .Fulfilled(let value):
                    fulfiller(value())
                case .Rejected(let error):
                    dispatch_async(onQueue){ fulfiller(body(error)) }
                case .Pending:
                    abort()
                }
            }
        }
    }
}
```

- `Promise<U>`の初期化の最後で`self.handlers`にクロージャが追加されている。上述の通り、`handlers`は`fulfiller`と`rejecter`内で呼ばれる`recurse`ですべて実行される。
- つまり、`then()`に渡されたクロージャは`handlers`に追加され、そのPromiseオブジェクトの非同期処理が完了したときに呼ばれることになる。
