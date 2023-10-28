---
title: jQueryでの選択解除
time: 2011-03-29 11:55
tags: ['jquery']
---

HTML

```
<table>
    <tr>
        <td>
            <input type="radio" name="A" value="0" />
            <input type="radio" name="B" value="1" />
            <input type="radio" name="C" value="2" />
            <input type="radio" name="D" value="3" />
        td>
    tr>
    <tr>
        <td>
            <select>
                <option selected="selected" value="AAA">AAAoption>
                <option value="BBB">BBBoption>
                <option value="CCC">CCCoption>
            select>
        td>
    tr>
    <tr>
        <td>
            <input id="reset" type="submit" value="reset" />
        td>
    tr>
table>
```

JavaScript

```
$('#reset').click(function (event) {
    event.preventDefault();
    $(':checked').attr('checked', false);
    $('select').attr('selectedIndex', 0);
});
```
