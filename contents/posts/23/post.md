---
title: jQueryで複数のテキストを取得する方法
time: 2010-12-28 16:50
tags: ['jquery']
---

　テーブル内のテキストを取得してグラフを描画する際に用いました。

HTML

```
<table>
  <tr>
    <th>1月th><td class='item'>10td><td class='user'>3td>
    <th>2月th><td class='item'>5td><td class='user'>1td>
    <th>3月th><td class='item'>20td><td class='user'>4td>
    <th>4月th><td class='item'>30td><td class='user'>6td>
    <th>5月th><td class='item'>10td><td class='user'>2td>
    <th>6月th><td class='item'>25td><td class='user'>4td>
    <th>7月th><td class='item'>25td><td class='user'>5td>
    <th>8月th><td class='item'>40td><td class='user'>9td>
    <th>9月th><td class='item'>35td><td class='user'>7td>
    <th>10月th><td class='item'>20td><td class='user'>5td>
    <th>11月th><td class='item'>10td><td class='user'>2td>
    <th>12月th><td class='item'>5td><td class='user'>1td>
  tr>
table>
```

JavaScript

```
var item_count = [];
  var user_count = [];

  jQuery.noConflict();
  jQuery(document).ready(function($){
    for(var i=0; i<$('.item').length; i++){
      item_count[i] = [i+1, $('.item:eq('+i+')').text()];
      user_count[i] = [i+1, $('.user:eq('+i+')').text()];
    }
  });
```

　セレクタを利用してi回目のループでi番目の要素からテキストを取得します。item\_countとuser\_countはグラフを描画する際に用います。
