---
title: Alamofireを読んだ
time: 2014-08-14 22:51
tags: ['swift']
---

# Alamofireとは

- [https://github.com/Alamofire/Alamofire](https://github.com/Alamofire/Alamofire)
- Swiftで書かれたHTTP通信ライブラリ。
- [AFNetworking](http://afnetworking.com/)の作者であるmatttさんの新作。
- AFNetworkingをリプレースするものではなく、AFNetworkingはSwiftでも安定して動くのでそのまま使えるとのこと。（参考: [http://nshipster.com/alamofire/](http://nshipster.com/alamofire/)の最後の方）
- ファイルは`Alamofire.swift`だけで1000行に満たない。

# 使い方

```
Alamofire.request(.GET, "http://httpbin.org/get")
         .responseJSON { (request, response, JSON, error) in
                           println(JSON)
                       }

Alamofire.request(.GET, "http://httpbin.org/get", parameters: ["foo": "bar"])
         .authenticate(HTTPBasic: user, password: password)
         .responseJSON { (request, response, JSON, error) in
                           println(JSON)
                       }
         .responseString { (request, response, string, error) in
                             println(string)
                         }
```

※読んだコードのコミット番号は`76266c95564912f228e76a1868e50b6a33f104e7`である。

# Alamofire.swift

## tl;dr

- `Manager`オブジェクトが通信を行い、通信完了時のdelegateオブジェクトを管理する。
  - 初期化時に`NSURLSession`オブジェクトやdelegateオブジェクトをプロパティとして保持する。
- `request`メソッドは以下のことをする。
  - `NSURLSessionTask`を生成して通信を開始する。
  - 実行する通信タスクに合わせたdelegateオブジェクトを設定する。delegateオブジェクトはユニークなSerial Dispatch Queueを持つが、最初は停止状態になっている。
  - `Request`オブジェクトを生成して返す。
- `response`メソッドは以下のことをする。
  - 引数に渡されたクロージャを停止状態になっているSerial Dispatch Queueに追加する。
  - 自分自身を返すため、続けて`response`メソッドをメソッドチェーンで呼ぶことができる。
- 通信が完了するとdelegateメソッドは以下のことをする。
  - 停止状態になっているSerial Dispatch Queueを再開する。追加されたタスクは順番に1つずつ実行されていく。

## L:25

```
public struct Alamofire {
    // ...
}
```

- `Alamofire`そのものはクラスではなくstructになっている。
- Swiftにおいてstructはクラスと同様にプロパティやメソッドを持つことができたりprotocolに準拠することができる等多くの点で共通しているのだけど、structはクラスとは違って常に値渡しになり参照カウントを使わない。

## L:928

最初に呼ばれるメソッドである`Alamofire.request`の実装を読む。

```
extension Alamofire {
    // ...

    static func request(method: Method, _ URL: String, parameters: [String: AnyObject]? = nil, encoding: ParameterEncoding = .URL) -> Request {
        return Manager.sharedInstance.request(encoding.encode(URLRequest(method, URL), parameters: parameters).0)
    }
}
```

- `static`とついているのは、クラスではなくstructだから`class func`ではなく`static func`と書くのであろう。Javaみたいに`static`に統一してもいいと思う。
- 内部では`Manager`クラスのシングルトンインスタンスの`request`メソッドを呼んでいる。
- 引数に`ParameterEncoding`インスタンスの`encode`メソッドの返り値を渡している。`.0`というのはtupleの要素を取り出すときにこういう書き方をする。

## L:141

`Manager`クラスの初期化について見る。

```
class Manager {
    class var sharedInstance: Manager {
        struct Singleton {
            static let instance = Manager()
        }

        return Singleton.instance
    }
}
```

- このシングルトンパターンの実装は[hpique/SwiftSingleton](https://github.com/hpique/SwiftSingleton)で推奨されているアプローチ。
- 現在はクラスにstaticな定数を定義することができない一方でstructであればそれが可能なので、ネストしたstructにシングルトンオブジェクトを定数として定義してそれを外側のクラスの型プロパティからアクセスできるようにしている。

## L:208

```
func request(request: NSURLRequest) -> Request {
    // ...

    var dataTask: NSURLSessionDataTask?
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0)) {
        dataTask = self.session.dataTaskWithRequest(mutableRequest)
    }

    let request = Request(session: self.session, task: dataTask!)
    self.delegate[request.delegate.task] = request.delegate
    request.resume()

    return request
}
```

- `NSURLSession`オブジェクトから`Request`オブジェクトを初期化している。
- `delegate`を登録し、`Request`オブジェクトの`resume`メソッドを呼んでいる。
- `Request`オブジェクトを返している。

## L:403

```
class Request {
    // ...

    private init(session: NSURLSession, task: NSURLSessionTask) {
        self.session = session

        if task is NSURLSessionUploadTask {
            self.delegate = UploadTaskDelegate(task: task)
        } else if task is NSURLSessionDownloadTask {
            self.delegate = DownloadTaskDelegate(task: task)
        } else if task is NSURLSessionDataTask {
            self.delegate = DataTaskDelegate(task: task)
        } else {
            self.delegate = TaskDelegate(task: task)
        }
    }

    // ...

    func resume() {
        self.task.resume()
    }
}
```

- `Request`オブジェクトは初期化されるときに渡された`task`のクラスに合わせて`delegate`プロパティを初期化している。
- `is`はオブジェクトがその型に属するかどうかをチェックする。
- `resume`メソッドは`task`プロパティ、つまり`NSURLSessionTask`（またはそのサブクラスの）オブジェクトの`resume`メソッドを呼び、ここで通信を開始する。

## L:208

`Request`オブジェクトの概要をつかんだので、`request`メソッドに戻る。

```
func request(request: NSURLRequest) -> Request {
    // ...

    let request = Request(session: self.session, task: dataTask!)
    self.delegate[request.delegate.task] = request.delegate
    request.resume()

    return request
}
```

- `request.delegate`は実行する`task`に応じたdelegateクラス、つまり`UploadTaskDelegate`, `DownloadTaskDelegate`, `DataTaskDelegate`, `TaskDelegate`のいずれかが入る。
- `request.resume()`で通信を開始する。
- 開始された通信が完了したときに呼ばれるdelegateは`request.delegate`であり、これは`self.delegate`という領域に確保される。このプロパティは`SessionDelegate`という型である。

## L:229

```
class SessionDelegate: NSObject, NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate, NSURLSessionDownloadDelegate {
    private var subdelegates: [Int: Request.TaskDelegate]
    private subscript(task: NSURLSessionTask) -> Request.TaskDelegate? {
        get {
            return self.subdelegates[task.taskIdentifier]
        }

        set(newValue) {
            self.subdelegates[task.taskIdentifier] = newValue
        }
    }

    // ...

    required override init() {
        self.subdelegates = Dictionary()
        super.init()
    }
}
```

- `SessionDelegate`オブジェクトは複数のdelegateをラップする構造をもっているようだ。
- subscriptを定義することで`self.delegate[request.delegate.task] = request.delegate`のようなアクセスを実現している。内部では、キーとして渡された`Request.TaskDelegate`オブジェクトの`taskIdentifier`を実際のキーとして使っているようだ。オブジェクトそのものではなくInt型のidentifierをキーとして使った方が効率がいいのだろう。

`request`メソッドの実装についておおまかに読んだので、続いて`response`メソッドを読んでいく。`response`メソッドは`request`メソッドの返り値である`Request`型に対して呼ばれているので、`Request`クラスの定義を調べる。

## L:458

```
func response(completionHandler: (NSURLRequest, NSHTTPURLResponse?, AnyObject?, NSError?) -> Void) -> Self {
    return response({ (request, response, data, error) in
                        return (data, error)
                    }, completionHandler: completionHandler)
}

func response(priority: Int = DISPATCH_QUEUE_PRIORITY_DEFAULT, queue: dispatch_queue_t? = nil, serializer: (NSURLRequest, NSHTTPURLResponse?, NSData?, NSError?) -> (AnyObject?, NSError?), completionHandler: (NSURLRequest, NSHTTPURLResponse?, AnyObject?, NSError?) -> Void) -> Self {

    dispatch_async(self.delegate.queue, {
        dispatch_async(dispatch_get_global_queue(priority, 0), {
            let (responseObject: AnyObject?, error: NSError?) = serializer(self.request, self.response, self.delegate.data, self.delegate.error)

            dispatch_async(queue ?? dispatch_get_main_queue(), {
                completionHandler(self.request, self.response, responseObject, error)
            })
        })
    })

    return self
}
```

- `response`メソッドに`completionHandler`だけ渡すと、前者のメソッドが呼ばれ内部的に後者のメソッドが呼ばれる。
- `self.delegate.queue`プロパティは`Request.TaskDelegate`クラス（またはそのサブクラス）のプロパティであり、レスポンスの処理はこのqueueで行われるようだ。このqueueについて詳しく見ていくことにする。

## L:497

```
private class TaskDelegate: NSObject, NSURLSessionTaskDelegate {
    // ...

    let queue: dispatch_queue_t?

    // ...

    init(task: NSURLSessionTask) {
        // ...

        let label: String = "com.alamofire.task-\(task.taskIdentifier)"
        let queue = dispatch_queue_create((label as NSString).UTF8String, DISPATCH_QUEUE_SERIAL)
        dispatch_suspend(queue)
        self.queue = queue
    }
}
```

- `queue`は`task`に対して一意なラベルを持ったSerial Dispatch Queueである。
- つまり、各タスクに対してキューが1つ作成される。そのキューは追加されたタスクを1つずつ順番に実行していく。
- そして、`dispatch_suspend`によってキューは停止された状態になっているため、この状態ではタスクが追加されてもすぐに実行されるわけではない。

`self.delegate.queue`がどのようなキューなのか把握したので`response`メソッドに戻る。

## L:464

```
func response(priority: Int = DISPATCH_QUEUE_PRIORITY_DEFAULT, queue: dispatch_queue_t? = nil, serializer: (NSURLRequest, NSHTTPURLResponse?, NSData?, NSError?) -> (AnyObject?, NSError?), completionHandler: (NSURLRequest, NSHTTPURLResponse?, AnyObject?, NSError?) -> Void) -> Self {

    dispatch_async(self.delegate.queue, {
        dispatch_async(dispatch_get_global_queue(priority, 0), {
            let (responseObject: AnyObject?, error: NSError?) = serializer(self.request, self.response, self.delegate.data, self.delegate.error)

            dispatch_async(queue ?? dispatch_get_main_queue(), {
                completionHandler(self.request, self.response, responseObject, error)
            })
        })
    })

    return self
}
```

- タスクごとのキューに追加される。ただし、この段階ではキューは停止状態なのでまだ実行されない。
- 各タスクごとのキューから、グローバルキューにタスクを追加している。グローバルキューに追加されたタスクは並列に実行される。
- グローバルキューでは、通信が完了した結果を`serializer`によってシリアライズし、その結果を`response`メソッドに渡した`completionHandler`というクロージャに渡して今度はメインキューに追加する。メインキューに追加されたタスクはメインスレッドで実行される。
- キューにタスクを追加したら即時に自分自身を返している。こうすることで`response`メソッド（とそれに準ずるメソッド）をメソッドチェーンでつなげていくことができる。その場合、メソッドチェーンによって追加されていくタスクは各タスクのSerial Dispatch Queueによって追加された順番に実行されていく。

次に、通信が完了したあとdelegateがどのように呼ばれていくか調べる。まず、delegateオブジェクトは何か調べるため、`NSURLSession`オブジェクトが初期化されている部分を読む。

## L:197

```
class Manager {
    // ...

    required init(configuration: NSURLSessionConfiguration! = nil) {
        self.delegate = SessionDelegate()
        self.session = NSURLSession(configuration: configuration, delegate: self.delegate, delegateQueue: self.operationQueue)
    }
}
```

- まず`NSURLSession`オブジェクトはManagerオブジェクトのプロパティである。
- `NSURLSession`オブジェクトのdelegateは`SessionDelegate`オブジェクトとなっている。

## L:229

```
class SessionDelegate: NSObject, NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate, NSURLSessionDownloadDelegate {
    // ...
}
```

- 確かにdelegateオブジェクトに必要なprotocolに準拠している。

`NSURLSessionDataDelegate`のメソッドの実装を見てみる。

## L:336

```
func URLSession(session: NSURLSession!, dataTask: NSURLSessionDataTask!, didReceiveData data:NSData!) {
    if let delegate = self[dataTask] as? Request.DataTaskDelegate {
        delegate.URLSession(session, dataTask: dataTask, didReceiveData: data)
    }

    self.dataTaskDidReceiveData?(session, dataTask, data)
}
```

- 上述の通り、`SessionDelegate`オブジェクトは`subdelegates`というプロパティに実際のdelegateを保持しており、独自のsubscriptからそこにアクセスできる。subdelegatesへのdelegateオブジェクトの追加は`request`メソッド内で行われているので、そこで追加されたdelegateオブジェクトが実際に処理を行うことになる。
- `as?`はダウンキャストを行い失敗した場合はnilを返す。
- `self.dataTaskDidReceiveData?`というのはOptional型のクロージャのプロパティ。どこかでセットされていればここで実行するような仕組みになっているのだと思う。

というわけで、実際にdelegateメソッドを実行しているクラスを読む。

## L:598

```
func URLSession(session: NSURLSession!, dataTask: NSURLSessionDataTask!, didReceiveData data: NSData!) {
    self.dataTaskDidReceiveData?(session, dataTask)

    self.mutableData.appendData(data)
}
```

- ここではあんまり大したことはしていない。

`NSURLSession`オブジェクトによる通信が完了したときに呼ばれるdelegateメソッドは`NSURLSessionTaskDelegate`プロトコルの`URLSession(_:task:didCompleteWithError:)`というメソッドなので、これの実装を読む。

# L:558

```
func URLSession(session: NSURLSession!, task: NSURLSessionTask!, didCompleteWithError error: NSError!) {
    self.error = error
    dispatch_resume(self.queue)
}
```

- このメソッドは先ほどのメソッドが実装されていた`DataTaskDelegate`クラスのスーパークラスである`TaskDelegate`に定義されている。
- `dispatch_resume`で停止状態になっていたキューを再開し、追加されていたタスクを実行する。上述の通り、この`self.queue`はタスクごとに作られたSerial Dispatch Queueであり作成直後に停止状態にしておいたもので、`response`メソッド（およびそれに似たメソッド）で追加されたクロージャがここに追加されている。それらのメソッドが通信完了時によばれるdelegateでキューが再開することで順番に実行される、という仕組みになっていることが判明した。
