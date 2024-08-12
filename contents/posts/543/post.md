---
title: Windowsのキーマッピング3
time: 2024-08-12 19:49
tags: ["windows"]
---

[前回](/posts/522)の設定から1年経って微調整したのでメモ。

# AutoHotKey

```
; VSCodeのみhjklでのカーソル移動を有効にする
#HotIf WinActive("ahk_exe Code.exe")
    ^h::Send '{Left}'
    ^j::Send '{Down}'
    ^k::Send '{Up}'
    ^l::Send '{Right}'
#HotIf
```

すべてのアプリケーションでhjklによるカーソル移動を有効にしていたけど、ブラウザでCtrl+Lを多用するため不便に感じていた。

AutoHotKeyにはアプリケーションごとにホットキーを設定することもできるため、VSCodeのみhjklによるカーソル移動を有効化して解決した。v2になって`#IfWinActive`から`#HotIf WinActive`に記法が変わっていたので少しハマった。

参考: https://www.autohotkey.com/docs/v2/lib/_HotIf.htm#variant
