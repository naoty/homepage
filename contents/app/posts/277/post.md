---
title: HIGで推奨されているアラートをSwiftで効率的に組み立てる
time: 2016-02-17 10:00
tags: ['ios', 'swift']
---

最近、Swiftにおけるエラーハンドリングについて興味をもっている。エラーハンドリングの中でアラートを組み立てて表示するコードをよく書いたり、目にしている。アラートを実装する際に気をつけているのは、ユーザーが目にしたときになるべく怒らせないようにすることだ。 **ユーザーフレンドリーなアラートを実装する上で参考にするため、Human Interface Guidelines（以下、HIG）を読んでいる** 。HIGを読むと、アラートの実装にあたって問題点が見えてきた。

# 問題点

- `UIAlertController`でアラートを組み立てるとき、テンプレのようなコードを長々書かないといけない。
- `UIAlertController`を使ってHIGで推奨されるアラートを組み立てるには、HIGの理解と注意深い実装が必要になる。

# 解決策

Swiftの表現力を駆使して、テンプレのようなコードをなるべく排除し、HIGの中で望ましいとされるUIを効率的に組み立てられるような設計を考えた。HIGでは、アラートは1つまたは2つのボタンを持つべきで、ボタンが3つ以上の場合はアクションシートを検討すべきだと書かれている。 **アラートを1つのボタンを持つ`Confirmation`と2つのボタンを持つ`Suggestion`という2つのタイプに分類して、以下のようなenumで表現する** ことを考えてみた。

```
enum Alert {
    case Confirmation
    case Suggestion
}
```

この`Alert`という型の値から`UIAlertController`を生成する必要がある。 **アラートに表示する情報はエラーオブジェクトから取得できると、エラーごとに表示すべき情報が統一されて効率的** だと思う。そこで、以下のように`NSError`を各caseに関連付け（[前回記事](http://naoty.hatenablog.com/entry/2016/02/10/132555)を読むと`NSError`ではなく`FriendlyErrorType`を使うべき場面だと分かる）、`viewController`というプロパティを定義した。

```
enum Alert {
    case Confirmation(NSError)
    case Suggestion(NSError)

    var viewController: UIAlertController {
        switch self {
        case .Confirmation(let error):
            let alertController = buildAlertControllerWithError(error)

            let cancel = UIAlertAction(title: "OK", style: .Cancel, handler: nil)
            alertController.addAction(cancel)

            return alertController
        case .Suggestion(let error):
            // 省略
        }
    }
}
```

ここでの`buildAlertControllerWithError(_:)`は`NSError`のもつ各情報を使って`UIAlertController`を初期化するようなイメージだ。

`Suggestion`の場合、エラーから復帰するためのアクションをユーザーに提案することになるため、 **その「復帰するためのアクション」を`Recovery`として以下のように表現してみる** 。

```
struct Recovery {
    let name: String
    let style: RecoveryStyle
    let recover: UIAlertAction -> Void

    enum RecoveryStyle {
        case Nondestructive
        case Destructive
    }
}
```

`RecoveryStyle`は復帰するためのアクションが破壊的（＝アクション前に戻せない）か、非破壊的（＝アクション前に戻せる）かを表している。なぜこれらを区別するかというと、 **HIGでは破壊的なアクションは赤字のタイトルにし、アラートの左側にボタンを置くべきとされている** からだ。逆に非破壊的なアクションのためのボタンは右側に置くべきとされている。

`Recovery`を踏まえると、`Alert`の実装は以下のようになる。

```
enum Alert {
    case Confirmation(NSError)
    case Suggestion(NSError, Recovery)

    var viewController: UIAlertController {
        switch self {
        case .Confirmation(let error):
            // 省略
        case .Suggestion(let error, let recovery):
            let alertController = buildAlertControllerWithError(error)
            let cancel = UIAlertAction(title: "Cancel", style: .Default, handler: nil)

            switch recovery.style {
            case .Nondestructive:
                let recover = UIAlertAction(title: recovery.name, style: .Default, handler: recovery.recover)
                alertController.addAction(cancel)
                alertController.addAction(recover)
            case .Destructive:
                let recover = UIAlertAction(title: recovery.name, style: .Destructive, handler: recovery.recover)
                alertController.addAction(recover)
                alertController.addAction(cancel)
            }

            return alertController
        }
    }
}
```

`RecoveryStyle`によって`addAction`の順番を変えている。これによってHIGで推奨されているボタンの配置になる。

# 利用例

```
let alert = Alert.Confirmation(error)
presentViewController(alert.viewController, animated: true, completion: nil)
```

![f:id:naoty_k:20160216000628p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20160216/20160216000628.png "f:id:naoty\_k:20160216000628p:plain")

```
let recovery = Alert.Recovery(name: "Recover", style: .Nondestructive) { action in
    print("Recover!!")
}
let alert = Alert.Suggestion(error, recovery)
presentViewController(alert.viewController, animated: true, completion: nil)
```

![f:id:naoty_k:20160216001159p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20160216/20160216001159.png "f:id:naoty\_k:20160216001159p:plain")

```
let recovery = Alert.Recovery(name: "Recover", style: .Destructive) { action in
    print("Recover!!")
}
let alert = Alert.Suggestion(error, recovery)
presentViewController(alert.viewController, animated: true, completion: nil)
```

![f:id:naoty_k:20160216000952p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20160216/20160216000952.png "f:id:naoty\_k:20160216000952p:plain")

# まとめ

- HIGに沿って実装するとユーザーフレンドリーなアラートになる（はず）。
- HIGに沿って実装するのは、HIGの理解と注意深い実装が必要になる。
- 上記のようなSwiftの表現力を駆使した設計によって、効率的にHIGに沿ったユーザーフレンドリーな実装を可能にできる。

# 関連記事

<iframe src="http://naoty.hatenablog.com/embed/2016/02/10/132555" title="FriendlyErrorType - naoty.to_s" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 190px; max-width: 500px; margin: 10px 0px;"></iframe>
