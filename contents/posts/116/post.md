---
title: Railsで使ってる間に合わせのCSS
time: 2012-04-29 00:00
tags: ['css']
---

Railsやるときに「あとでちゃんとCSS作るけど、今はテキトーなスタイルでいいや」っていうときに使ってるCSS。わかる人にはわかる某サイトのデモを意識した。

```css:application.css.scss
//= require_self
//= require_tree .

html {
  background-color: #4B7399;
  font-family: Verdana, Helvetica, Arial;
  font-size: 14px;
}

body {
  background-color: #FFFFFF;
  border: 1px solid #000000;
  margin: 50px auto;
  padding: 20px;
  width: 680px;
}

p {
  margin-bottom: 10px;
}

h1, h2 {
  font-weight: bold;
  margin-bottom: 10px;
}

h1 {
  font-size: 34px;
}

h2 {
  font-size: 21px;
}
```
