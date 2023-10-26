---
title: マシなiOSアプリのフォームを実装・デザインする
time: 2014-09-18 01:22
tags: ['ios']
---

普段iOSのフロント寄りの実装やデザインについて手が着けられていなかったけど、Xcode6の新機能のおかげでそっちも興味がでてきたので、ログインフォームを想定してiOSアプリのフォームの設計について本気出して考えてみた。

# 最もシンプルなフォーム

![f:id:naoty_k:20140918011114p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20140918/20140918011114.png "f:id:naoty\_k:20140918011114p:plain")

- メールアドレス用の`UITextField`（以下`emailField`）、パスワード用の`UITextField`（以下`passwordField`）、そしてログインボタン用の`UIButton`（以下`loginButton`）の3つをStoryboardで配置した。
- `emailField`はKeyboard TypeをE-mail Addressに、Return KeyをNextに設定した。`passwordField`はSecure Text EntryのチェックをオンにしReturn KeyをGoに設定した。

## 問題点

- `emailField`でReturn Keyを押しても`passwordField`が選択されないし、`passwordField`でReturn Keyを押してもsubmitされない。
- コントロール部品以外をタップしたとき、キーボードが閉じない。端末サイズが小さい場合、キーボードによって他のコントロールや表示すべきViewが隠れたままになる可能性がある。
- 追加した3つのViewが指の大きさに対して小さい。ユーザーは正確にタップするために注意を向ける必要があり、間違ったViewをタップしてしまう可能性がある。

# 改善1: Return Keyで適切なアクションを起こす

```
// ViewController.swift

@IBOutlet var emailField: UITextField?
@IBOutlet var passwordField: UITextField?
@IBOutlet var loginButton: UIButton?

@IBAction func login() {
    println("Login")
}

// MARK: - UITextFieldDelegate

func textFieldShouldReturn(textField: UITextField) -> Bool {
    if (textField == emailField) {
        passwordField?.becomeFirstResponder()
    } else {
        login()
    }

    return true
}
```

- `login()`は`loginButton`が押された場合、または`passwordField`でReturn Keyが押された場合に実行される。今後、このメソッドにログイン処理を実装していく予定。
- `emailField`と`passwordField`の`delegate`をこのViewControllerに設定し`textFieldShouldReturn(textField:)`を実装することで、2つのUITextFieldでReturn Keyが押されたときの処理を実装できる。
- `becomeFirstResponder()`はレシーバーのViewを最初に応答するオブジェクトとして設定する。キーボードはこのFirst Responderに合わせてキーボードタイプや入力先を替える。

# 改善2: キーボードを閉じる

```
@IBAction func login() {
    resignFirstResponderAtControls()
    println("Login")
}

override func touchesBegan(touches: NSSet, withEvent event: UIEvent) {
    resignFirstResponderAtControls()
}

private func resignFirstResponderAtControls() {
    emailField?.resignFirstResponder()
    passwordField?.resignFirstResponder()
}
```

- 非公開メソッドとして`resignFirstResponderAtControls()`を定義した。これによって2つのUITextFieldの選択状態を外しキーボードを閉じることができる。`resignFirstResponder()`メソッドはレシーバーのViewをFirst Responderでなくす。これによってキーボードが閉じる。
- これを`login()`と`touchesBegan(touches:withEvent:)`で呼び出す。
- `UIViewController`は`UIResponder`を継承しており`self.view`のイベントハンドリングを扱うことができる。そのため、`touchesBegan(touches:withEvent:)`で`resignFirstResponderAtControls()`を呼ぶことで、追加した3つのView以外を選択されたときにキーボードを閉じることができる。

# 改善3: タップしやすくする

「ヒューマンユーザーインターフェイスガイドライン」（以下HIG）にはこのような指針が載っている。

> アプリケーション内のタップ可能な要素には、約44x44ポイントのターゲット領域を割り当てる。

これに従って「44x44ポイント以上」にサイズを変更する。

まず、`UITextField`は高さが30ポイントに固定されているため、高さ44ポイントのViewの上に`UITextField`を乗せてボーダーを非表示にし、その親Viewがタップされたら`UITextField`がFirst Responderになるようにする。実装としては、`UITextField`を含む高さ44ポイントの`UIView`のサブクラスを用意する。

```
// TextFieldContainer.swift

@IBDesignable
class TextFieldContainer: UIView {
    @IBInspectable
    var borderWidth: CGFloat = 0 {
        didSet {
            layer.borderWidth = borderWidth
        }
    }

    override func touchesBegan(touches: NSSet, withEvent event: UIEvent) {
        subviews.first?.becomeFirstResponder()
    }
}
```

Xcode 6からの新機能であるLive Viewsを利用し、カスタムViewも可能な限りStoryboard上でそのプロパティを変更できるようにする。

- `@IBDesignable`によってカスタムViewをStoryboard上でレンダリングして、その見た目をStoryboardからも確認できるようになる。
- `@IBInspectable`によって下のスクリーンショットのようにカスタムViewの`borderWidth`というプロパティをStoryboardから変更できるようになる。

![f:id:naoty_k:20140918011350p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20140918/20140918011350.png "f:id:naoty\_k:20140918011350p:plain")

次に、`UIButton`もHIGの方針に従って修正する。`UIButton`はサイズを自由に変更できるので、とりあえず44x44ポイントに変更した。ボタンの大きさは変更したものの、ボタンの「Login」というテキストはまだ小さいため、ユーザーの目からはサイズが大きくなったようには見えていない。そこで、ボタンにもボーダーをつけてみる。

```
// BorderedButton.swift

@IBDesignable
class BorderedButton: UIButton {
    @IBInspectable
    var borderWidth: CGFloat = 0 {
        didSet {
            layer.borderWidth = borderWidth
        }
    }
}
```

`TextFieldContainer`と同じようにstoryboardから枠線の幅を変えられるようにした。

# マシなフォーム

以上の変更を行った結果このようになった。

![f:id:naoty_k:20140918011412p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20140918/20140918011412.png "f:id:naoty\_k:20140918011412p:plain")

間違いなくタップはしやすくなった。

## 問題点

- フラットデザインに則っていない。標準のアプリや人気の高いアプリはiOS 7から導入されたフラットデザインに沿ってデザインされており、同様なインターフェイスをもたなければユーザーは慣れ親しんだ動作で直感的にアプリを操作できなくなってしまう。

## 改善4: フラットデザインに従う

HIGではフラットデザインの基本的な設計方針として以下の3つを挙げている。

> - 控えめであること
> - 明瞭であること
> - 奥行きを与えること

具体的な作業として

- 画面全体を使う
- 枠線を使わない
- 余白を十分にとる

を意識してStoryboardを編集した。Auto Layoutで各Viewの余白を固定したり、枠線の太さを0ポイントにした。その結果、以下のようになった。

![f:id:naoty_k:20140918011429p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20140918/20140918011429.png "f:id:naoty\_k:20140918011429p:plain")

フラットデザインに対するよくある批判として「ボタンがどこにあるのか認識しにくい」というものがある。"Email"や"Login"といった文字がある部分にしかViewがないように見えてしまうため、Viewの領域を表す枠線や背景色を控えめに加えた方がもっとよくなると考えた。そこで、2つの`UITextField`の領域を控えめに表すため、領域の下辺だけ枠線を表示してみる。

```
// TextFieldContainer.swift

@IBDesignable
class TextFieldContainer: UIView {
    private var width: CGFloat {
        return CGRectGetWidth(frame)
    }
    private var height: CGFloat {
        return CGRectGetHeight(frame)
    }
    private let borderBottom: CALayer = CALayer()

    @IBInspectable
    var borderColor: UIColor = UIColor.blackColor() {
        didSet {
            setupBorderBottom()
        }
    }

    @IBInspectable
    var borderBottomWidth: CGFloat = 0 {
        didSet {
            setupBorderBottom()
        }
    }

    override func touchesBegan(touches: NSSet, withEvent event: UIEvent) {
        subviews.first?.becomeFirstResponder()
    }

    private func setupBorderBottom() {
        borderBottom.removeFromSuperlayer()
        borderBottom.frame = CGRectMake(0, height - borderBottomWidth, width, borderBottomWidth)
        borderBottom.backgroundColor = borderColor.CGColor
        layer.addSublayer(borderBottom)
    }
}
```

- 以前の実装にあった`borderWidth`を削除し、下辺の枠線の太さを表す`borderBottomWidth`と枠線の色を表す`borderColor`を追加した。これらのプロパティがXcodeから変更されるたびに`setupBorderBottom()`が呼び出されてborderが追加される。
- 下辺だけの枠線は枠線の幅を高さとする`CALayer`として実装した。
- ショートカットのため`width`と`height`というcomputed propertyを用意した。

そして、Storyboardから枠線の色と幅を設定し余白を調整すると以下のようになった。

![f:id:naoty_k:20140918011441p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20140918/20140918011441.png "f:id:naoty\_k:20140918011441p:plain")

# まとめ

最初と最後を比べると少しはマシなフォームになったと思う。改善したポイントをまとめると以下のようになる。

- Return Keyで適切なアクションを起こす
- キーボードを閉じる
- タップしやすくする
- フラットデザインに従う

現実の開発では、アプリごとのテーマに合わせた色やタイポグラフィを使うことになるだろうし、フォームのエラーメッセージの扱いについても触れられていない。残された課題については、経験を積む中で考えていくことにしたい。

最後に上で載せたコードを含んだプロジェクトをGitHubに公開したので参考にしてほしい。

[naoty/BetterFormApp · GitHub](https://github.com/naoty/BetterFormApp)
