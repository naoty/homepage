---
title: 通信周りの処理をミドルウェアで整理する
time: 2016-07-14 11:00
tags: ['swift']
---

# 課題感

APIリクエストの送信前、APIレスポンスの取得後にさまざまな処理をはさみたいことがある。例えば、こんな処理だ。

- ネットワークインジケータの表示・非表示
- リクエストとレスポンスのロギング
- 二重送信の防止
- ログイントークンが有効期限切れだったときに、リフレッシュトークンを使ってログイントークンを更新した後、再送
- HTTPリクエストのスタブ

ただ、こういった処理をAPIクライアントにそのまま実装していくとAPIクライアントが肥大化するし、かと言ってViewControllerに実装するといろんな箇所で似たようなコードを書くことになる。

# 解決策

APIクライアントをラップして機能を拡張するミドルウェアをつくる。ミドルウェアはAPIクライアントを呼び出して通信処理を実行しつつ、リクエストの送信前とレスポンスの取得後に処理をはさむ。

例えば、`APIClient`というオブジェクトで本来の通信処理を実行するとする。ロギングを行うミドルウェアはこんな感じになる。

```
extension Middleware {
    struct Logger: RequestSendable {
        let client: RequestSendable

        func send(request: T) -> Task {
            print(request)
            return client.send(request)
                .success { response -> Task in
                    print(response)
                    return Task(value: response)
                }
                .failure { error, _ in
                    print(error)
                    return Task(error: error ?? ApplicationError.Unknown)
                }
        }
    }
}
```

そして、こんな感じで初期化する。

```
let client: RequestSendable = Middleware.Logger(client: APIClient())
```

だけど、ミドルウェアが増えると、以下のように初期化が大変になってくる。

```
let client: RequestSendable = A(client: B(client: C(client: D(client: APIClient()))))
```

そこで、ミドルウェア群を簡単に組み合わせるための仕組みをつくる。

```
extension Middleware {
    struct Stack {
        let middlewareTypes: [RequestSendable.Type]

        init(_ middlewareTypes: [RequestSendable.Type]) {
            self.middlewareTypes = middlewareTypes
        }

        func buildClient() -> RequestSendable {
            let client = APIClient()
            return middlewareTypes.reverse().reduce(client) { (result: RequestSendable, middlewareType: RequestSendable.Type) in
                return middlewareType.init(client: result)
            }
        }
    }
}
```

これによって、こんな感じで直感的にAPIクライアントを初期化できる。

```
let client = Middleware.Stack([A.self, B.self, C.self, D.self]).buildClient()
```

たいていの場合、利用するミドルウェアは同じなのでデフォルトで利用するミドルウェアスタックを簡単に初期化できるようにする。

```
extension Middleware {
    struct Stack {
        // ...

        static func defaultStack() -> Stack {
            var middlewares: [RequestSendable.Type] = []

            middlewares.append(A.self)

            if someCondition {
                middlewares.append(B.self)
            }

            middlewares.append(C.self)

            reeturn Stack(middlewares)
        }
    }
}
```

そして、APIクライアントの初期化はこうなる。

```
let client = Middleware.Stack.defaultStack().buildClient()
```

# まとめ

通信周りのさまざまな処理をミドルウェアという形で実装することで、疎結合なモジュールに分離することができた。将来的に新たな処理を追加する場合でもミドルウェアを新たに実装してスタックに追加するだけでよく、既存のAPIクライアントやミドルウェアに手を加える必要はない。テスト時のみ不要なミドルウェアを除くといった柔軟な設定も可能になるだろう。
