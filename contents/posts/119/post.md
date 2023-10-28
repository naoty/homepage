---
title: 最初のActivityに戻る
time: 2012-05-18 19:56
tags: ['android']
---

A→B→C→Dなどと複数のアクティビティを遷移した後、最初のAに戻る実装。

```java:DActivity.java
Intent intent = new Intent(DActivity.this, AActivity.class);
intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
startActivity(intent);
```

- `FLAG_ACTIVITY_CLEAR_TOP`は、遷移先のアクティビティが既に動いていればそのアクティビティより上にある（この場合はB, C, D）アクティビティを消す、という挙動を設定する。これによって、A→B→C→D→Aと遷移した後にbackボタンを押してもDに戻ることはなくなる。
- `FLAG_ACTIVITY_SINGLE_TOP`は、既に動いているアクティビティに遷移するとそのアクティビティを閉じてもう一度作りなおすデフォルトの挙動（multiple mode）から、作りなおさずに再利用する挙動に変更する。これによって、D→Aへの遷移のときのアニメーションが戻る動きになる。

### 参考
- http://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_CLEAR_TOP
