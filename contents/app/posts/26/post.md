---
title: jQueryでchangeイベント内で変更後の値を取得する
time: 2011-01-18 15:13
tags: ['jquery']
---

HTML（セレクトボックス）

```
<select id='date_year' name='year'>
  <option value='2005'>2005option>
  <option value='2006'>2006option>
  <option value='2007'>2007option>
  <option value='2008'>2008option>
  <option value='2009'>2009option>
  <option value='2010'>2010option>
  <option value='2011' selected='selected'>2011option>
select>
```

jQuery

```
var date_year = $('#date_year');
date_year.change(function(){
  value = $(':selected', date_year).val(); // ':selected'で選択されたoptionを指定
});
```

イベントオブジェクトを利用した方法ってあるんだろうか？
