---
title: セレクトボックスの値を動的に設定する
time: 2011-03-09 13:31
tags: ['javascript']
---

　select1の値が変更されると、select2の値がselect1と同じ値に変更される。セレクトボックスがたくさんあって入力が煩わしいインターフェイスを改善するときに、考えました。HTMLSelectElementのselectedIndexプロパティには選択されたoption要素の番号が入っているので、それを他方のselect要素に代入することで、セレクトボックスの値を変更することができます。

HTML

```
<select id="select1">
    <option value="1">1option>
    <option value="2">2option>
    <option value="3">3option>
    <option value="4">4option>
    <option value="5">5option>
select>

<select id="select2">
    <option value="1">1option>
    <option value="2">2option>
    <option value="3">3option>
    <option value="4">4option>
    <option value="5">5option>
select>
```

JavaScript

```
var select1 = document.getElementById("select1"),
    select2 = document.getElementById("select2");
select1.change = function () {
    select2.selectedIndex = select1.selectedIndex;
};
```
