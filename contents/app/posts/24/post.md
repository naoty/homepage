---
title: form_tagでパラメータをつけて現在のページに遷移する
time: 2011-01-13 20:37
tags: ['rails']
---

　第一引数を省略すると、現在のページに遷移する。

```
form_tag({}, {:method => :get}) do
```
