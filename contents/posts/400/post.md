---
title: pictで複雑な組み合わせを生成する
description: pictの使い方とペアワイズ法の考え方を学んだ話
time: 2020-02-17 22:47
tags: ["test"]
---

[microsoft/pict](https://github.com/microsoft/pict)はペアワイズ法とよばれる手法を使って多くの変数から組み合わせを生成できる。macOSならHomebrewでインストールできる。

```
% brew install pict
```

例えば、あるiOSアプリを使っているユーザーには、ログインしているかどうか、課金プラン、決済方法といった状態の組み合わせがあるとする。そこで、下のようなテキストファイルを書く。

```
status: guest,member
plan: free,pro,premium
payment: -,iap,card,paypal
```

そのテキストファイルを`pict`にわたすと、ペアワイズ法にしたがって組み合わせを生成してくれる。

```
% pict user_pattern.txt
status	plan	payment
guest	free	card
member	premium	-
guest	pro	-
member	free	paypal
member	pro	iap
guest	premium	iap
member	pro	card
guest	premium	paypal
member	free	-
guest	free	iap
member	pro	paypal
guest	premium	card
```

[naoty/table](https://github.com/naoty/table)と組み合わせると、ちょっと見やすくなる。

```
% pict user_pattern.txt | table -H
+--------+---------+---------+
| status | plan    | payment |
+--------+---------+---------+
| guest  | free    | card    |
| member | premium | -       |
| guest  | pro     | -       |
| member | free    | paypal  |
| member | pro     | iap     |
| guest  | premium | iap     |
| member | pro     | card    |
| guest  | premium | paypal  |
| member | free    | -       |
| guest  | free    | iap     |
| member | pro     | paypal  |
| guest  | premium | card    |
+--------+---------+---------+
```

組み合わせの中に制約条件を加えることもできる。

ここでは、非ログインユーザーはクレジットカードで決済できないとか、そもそも無料会員なら決済方法は指定できないとか、そういう制約条件を指定してみた。

```
status: guest,member
plan: free,pro,premium
payment: -,iap,card,paypal

if [status] = "guest" then [payment] IN {"-", "iap"};
if [plan] = "free" then [payment] = "-";
```

```
% pict user_pattern.txt | table -H
+--------+---------+---------+
| status | plan    | payment |
+--------+---------+---------+
| member | premium | card    |
| guest  | pro     | iap     |
| member | pro     | -       |
| guest  | premium | -       |
| member | premium | iap     |
| member | pro     | card    |
| member | pro     | paypal  |
| guest  | free    | -       |
| member | free    | -       |
| member | premium | paypal  |
+--------+---------+---------+
```

ちゃんと制約条件が加味されて組み合わせができていることがわかる。

そもそもペアワイズ法というのは、全組み合わせほど網羅性はないが、テストケースとして有効かつ全組み合わせほどコストが高くない組み合わせを生成する方法だそう。つまり、コスパの良い組み合わせを生成する方法らしい。

いろんなケースで遊んでみて楽しかったし、応用範囲が広そうなツールなので今後も使っていきたい。
