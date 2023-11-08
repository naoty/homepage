---
title: Windowsのキーマッピング
time: 2023-08-08 21:24
tags: ['windows']
---

Windowsを久々に使い始めて一番戸惑ったのがキーマッピングだった。英字キーボードで日本語を入力するため、普段MacではKarabinerを使ってゴリゴリにカスタマイズしていたのだけど、Windowsでも同様のカスタマイズをしようとしたところKarabinerほど使いやすいアプリケーションがなかった。そして、1週間ほどの試行錯誤と妥協の末、ようやく落ち着いたのでブログに残しておきたい。

# Keyboard Manager

![](/posts/521/keyboard-manager.png)

Keyboard ManagerはPowerToysというWindows謹製のユーティリティアプリに同梱されているキーマッピングアプリで、シンプルなマッピングならこれで実現できる。

設定したのはこれだけ。

- CtrlとCapsLockの入れ替え
- Ctrl+hjklで上下左右の矢印キー入力

後述するalt-ime-ahkと併用する場合、CapsLockをAltに割り当てて入力するとそれ以降キー入力ができなくなる現象が発生することがわかり、Keyboard Managerの設定をなるべく最小限に抑えることにした。

# alt-ime-ahk

https://github.com/karakaram/alt-ime-ahk

MacのKarabinerで便利な設定だったコマンドキーの空打ちでIME切り替えるという挙動をWindowsで再現してくれる便利アプリで、これを導入してなるべくMacと近い操作感にした。

本当はAltをCtrlに割り当てることでMacとほぼ同じキーマッピングにしたかったのだけど、先述したCapsLockをAltに割り当てられない問題があるため、そこは妥協することとなった。

# キーボード

キーボードにはMistel Barocco MD770を使っているのだけど、裏面にあるDIPスイッチによってMacに最適化された配列にしていたため、Windowsで使うとAltキーとWindowsキーが入れ替わっていることに最初は気づかなかった。

OSによる差異はキーボードではなくOS上のアプリケーションによって吸収してほしいので、DIPスイッチはすべてオフにした。
