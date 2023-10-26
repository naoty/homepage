---
title: FriendlyErrorType
time: 2016-02-10 13:25
tags: ['swift']
---

# 新しいエラーハンドリング

Swift 2で`throw`を使ったエラーハンドリングが新たに導入された。従来の`NSError`を使ったエラーハンドリングの問題点は、メソッドに`NSError`ポインタの代わりに`nil`を渡すことで無視できてしまうことだった。新たに導入されたエラーハンドリングでは、`throws`キーワードが宣言されたメソッドを呼び出す際に`do-catch`文で囲うことを強制される。`throw`で投げられるエラーは`NSError`ではなく`ErrorType`というprotocolを実装した値だ。Cocoaフレームワーク内の`NSError`を使っていたメソッドは`throws`を使うように置き換えられており、今後は独自のエラーを定義する場合は`NSError`ではなく`ErrorType`を使うのが望ましいと考えられる。しかし、`ErrorType`にも問題点はあり現実的な設計方針を検討する必要がある。

# アプリ独自エラーの実装

`NSError`の代わりに`ErrorType`を使っていく流れがあるものの、`ErrorType`には`NSError`が持っていた`localizedDescription`や`userInfo`といったエラー情報がないという問題点がある。そこで、`ErrorType`を継承した新たなprotocolを定義するという方針を考えてみた。

```
protocol FriendlyErrorType: ErrorType {
    var summary: String { get }
    var reason: String? { get }
    var suggestion: String? { get }
}
```

この`FriendlyErrorType`を使って以下のように独自エラーを定義できる。

```
enum ApplicationError: FriendlyErrorType {
    case SomethingWrong
    case DecodeFailed([String])

    var summary: String {
        switch self {
        case .SomethingWrong:
            return "Something wrong"
        case .DecodeFailed(_):
            return "Decode failed"
        }
    }

    var reason: String? {
        switch self {
        case .SomethingWrong:
            return .None
        case .DecodeFailed(let fields):
            let failedFields = fields.joinWithSeparator(", ")
            return "Failed to decode following fields: \(failedFields)"
        }
    }
    
    var suggestion: String? {
        switch self {
        case .SomethingWrong:
            return .None
        case .DecodeFailed:
            return .None
        }
    }
}
```

また、Cocoaフレームワークのメソッドは`ErrorType`を投げるようになったものの、Alamofire等のライブラリを使う際には`NSError`を使うことになるため、`FriendlyErrorType`を実装するように`NSError`を拡張する。

```
extension NSError: FriendlyErrorType {
    var summary: String {
        return localizedDescription
    }
    
    var reason: String? {
        return userInfo[NSLocalizedFailureReasonErrorKey] as? String
    }
    
    var suggestion: String? {
        return userInfo[NSLocalizedRecoverySuggestionErrorKey] as? String
    }
}
```

## なぜprotocol extensionではなく継承なのか

protocol extensionだと`ErrorType`にデフォルトの実装を与えることになる。その場合、`ErrorType`として渡されたエラーに対してメソッドを呼ぶと、すべてそのデフォルトの実装の結果が返るようになる。一方、`FriendlyErrorType`はただのprotocolなので、メソッドの結果はメソッドを実装する各クラスの結果を反映する。

```
extension ErrorType {
    var summary: String {
        return ""
    }
}

extension NSError {
    var summary: String {
        return localizedDescription
    }
}

let error: ErrorType = NSError(domain: "com.github.naoty.playground", code: 1000, userInfo: [NSLocalizedDescriptionKey: "Something wrong"])
print(error.summary) //=> "\n"
```

```
protocol FriendlyErrorType: ErrorType {
    var summary: String { get }
}

extension NSError: FriendlyErrorType {
    var summary: String {
        return localizedDescription
    }
}

let error: FriendlyErrorType = NSError(domain: "com.github.naoty.playground", code: 1000, userInfo: [NSLocalizedDescriptionKey: "Something wrong"])
print(error.summary) //=> "Something wrong\n"
```

# エラーの利用例

`FriendlyErrorType`を実装したエラー型を実際に利用してみる。Alamofire、SwiftTask、Himotokiを使ってQiita APIを呼び出している。

```
return Task<Void, [Item], FriendlyErrorType> { progress, fulfill, reject, configure in
    Alamofire.request(.GET, "https://qiita.com/api/v2/items").responseJSON { response in
        switch response.status {
        case .Success(let value):
            if let objects = value as? [AnyObject] {
                var items: [Item] = []
                for object in objects {
                    do {
                        let item = try decode(object) as Item
                        items.append(item)
                    } catch DecodeError.MissingKeyPath(let keyPath) {
                        reject(ApplicationError.DecodeFailed(keyPath.components))
                    } catch {
                        reject(ApplicationError.SomethingWrong)
                    }
                }
                fulfill(items)
            } else {
                reject(ApplicationError.DecodeFailed(["root"]))
            }
        case .Failure(let error):
            reject(error)
        }
    }
}
```

`NSError`を拡張しているため、`ApplicationError`と`NSError`を`FriendlyErrorType`として並べて扱うことができている。

`FriendlyErrorType`を使ってアラートを表示する実装は以下のようなイメージだ。

```
let title = error.summary

var message = ""
if let reason = error.reason {
    message += reason
    message += "\n"
}
if let suggestion = error.suggestion {
    message += suggestion
}

let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
presentViewController(alertController, animated: true, completion: nil)
```

以上のような方針に基づいたサンプルアプリケーションを用意した。

[naoty/MyQiita](https://github.com/naoty/MyQiita)

# 関連記事

<iframe src="http://naoty.hatenablog.com/embed/2016/02/17/100000" title="HIGで推奨されているアラートをSwiftで効率的に組み立てる - naoty.to_s" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 190px; max-width: 500px; margin: 10px 0px;"></iframe>
