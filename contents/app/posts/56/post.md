---
title: jQueryでテキストエリアのキャレットを先頭に移動する
time: 2011-05-23 18:48
tags: ['jquery']
---

```
$(function (){
    var $text_area = $('#text_area');
    $text_area.attr('selectionEnd', 0);
    $text_area.attr('selectionStart', 0);
    $text_area.focus();
})
```

focus()を使うと、文末にキャレット（カーソル）が移動してしまうので、selectionEnd属性とselectionStart属性を0に指定してあげることで、先頭に移動することができます。Firefoxのみで検証したので、IEについても検証次第、追記します。取り急ぎ。
