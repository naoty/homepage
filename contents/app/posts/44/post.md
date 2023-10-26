---
title: jQueryによるアコーディオンパネル
time: 2011-03-15 14:04
tags: ['jquery']
---

```
<ul>
    <li class="pref"><a href="#">miyagia>li>
    <li class="city"><a href="#">sendaia>li>
    <li class="city"><a href="#">kesennumaa>li>
    <li class="city"><a href="#">ishinomakia>li>
    <li class="city"><a href="#">onagawaa>li>
    <li class="pref"><a href="#">iwatea>li>
    <li class="city"><a href="#">miyakoa>li>
    <li class="city"><a href="#">rikuzentakadaa>li>
    <li class="pref"><a href="#">fukushimaa>li>
    <li class="city"><a href="#">soumaa>li>
ul>
```

```
$("li.pref").click(accordion); // (1)

function accordion(e) {
    var $this = $(this);
    if (!$this.hasClass("opened")) { // (2)
        $("li.opened").removeClass("opened").nextUntil(".pref").slideUp(); // (3)
        $this.addClass("opened").nextUntil(".pref").slideDown(); // (4)
    } else { // (5)
        $this.removeClass("opened").nextUntil(".pref").slideUp(); // (6)
    }
    e.preventDefault(); // (7)
}
```

(1)：「pref」クラスを持つli要素がクリックされると、accordion関数が実行される。  
(2)：クリックされたli要素が「opened」クラスを持っていなければ、  
(3)：「opened」クラスを持つli要素から「opened」クラスを取り除き、このli要素と次に現れる「pref」クラスを持つli要素との間にあるli要素をslideUpする。  
(4)：クリックされたli要素に「opened」クラスをつけ、このli要素と次に現れる「pref」クラスを持つli要素との間にあるli要素をslideDownする。  
(5)：クリックされたli要素が「opened」クラスを持っていれば、  
(6)：クリックされたli要素から「opened」クラスを取り除き、このli要素と次に現れる「pref」クラスを持つli要素との間にあるli要素をslideUpする。  
(7)：li直下にあるa要素にデフォルトでセットされているイベント（他ページへのジャンプ）を実行させない。
