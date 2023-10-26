---
title: scss内でimageを参照したいとき
time: 2012-03-01 00:46
tags: ['rails']
---

background-imageで画像を参照したいとき、sass-railsが提供するヘルパーを使うと簡単に書ける。

```scss:app/assets/stylesheets/application.css.scss
span.naoty {
  background-image: image-url("naoty.png") //=> url(/assets/naoty.png)
  // or backgroud-image: url(image-path("naoty.png"))
}
```
