---
title: ダークモードのサポート
time: 2019-10-13 16:00
tags: ["meta", "css"]
---

このホームページがOSのダークモードをサポートした。macOSとAndroidで動作確認した。

![](dark-theme.gif 'ダークテーマが切り替わる様子')

ダークモードをサポートするには、以下のようにメディアクエリを使ってダークモードで適用するスタイルを指定する。

```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: #2e3440;
  }
}
```

ダークモード用のカラースキーマには、VSCodeでも使っている[Nord](https://www.nordtheme.com)を参考にしている。

# 参考
* https://developer.mozilla.org/ja/docs/Web/CSS/@media/prefers-color-scheme
