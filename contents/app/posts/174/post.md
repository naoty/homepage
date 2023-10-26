---
title: Arduinoと感圧センサーで圧力をサーバーに送信する
time: 2013-03-11 22:51
tags: ['arduino']
---

秋葉原の秋月電子に行って、慣れない雰囲気の中、なんとか[この感圧センサー](http://akizukidenshi.com/catalog/g/gP-04002/)をゲットしました。

<script src="https://gist.github.com/naoty/4606687.js"></script>

オライリーの[Prototyping Lab](http://www.oreilly.co.jp/books/9784873114538/)という本を見ながら回路を接続して、上のようなプログラムを実行するとこんな感じになりました。

![f:id:naoty_k:20130123235951g:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130123/20130123235951.gif "f:id:naoty\_k:20130123235951g:plain")

センサーに加わった圧力を0番のアナログピンから受け取り、シリアル通信でそのままモニタに出力しています。

この圧力をサーバーに送信するために、以下のものを買いました。

[![イーサネットシールド for Arduino (micro SD, Wiznet W5100)](http://ecx.images-amazon.com/images/I/51U3f1gyqVL._SL160_.jpg "イーサネットシールド for Arduino (micro SD, Wiznet W5100)")](http://www.amazon.co.jp/exec/obidos/ASIN/B007YJA4WE/hatena-blog-22/)

[イーサネットシールド for Arduino (micro SD, Wiznet W5100)](http://www.amazon.co.jp/exec/obidos/ASIN/B007YJA4WE/hatena-blog-22/)

- 出版社/メーカー: OEM
- メディア: エレクトロニクス
- [この商品を含むブログを見る](http://d.hatena.ne.jp/asin/B007YJA4WE/hatena-blog-22)

ArduinoにぶっさすEthernetシールド。ここにLANケーブルをさしてインターネットに接続できます。

[![PLANEX 300Mbps 超小型ハイパワー無線LANマルチファンクションルータ/アクセスポイント/コンバータ MZK-MF300N](http://ecx.images-amazon.com/images/I/316uVztilYL._SL160_.jpg "PLANEX 300Mbps 超小型ハイパワー無線LANマルチファンクションルータ/アクセスポイント/コンバータ MZK-MF300N")](http://www.amazon.co.jp/exec/obidos/ASIN/B003STEHMW/hatena-blog-22/)

[PLANEX 300Mbps 超小型ハイパワー無線LANマルチファンクションルータ/アクセスポイント/コンバータ MZK-MF300N](http://www.amazon.co.jp/exec/obidos/ASIN/B003STEHMW/hatena-blog-22/)

- 出版社/メーカー: プラネックス
- 発売日: 2010/07/16
- メディア: Personal Computers
- 購入: 11人 クリック: 216回
- [この商品を含むブログ (14件) を見る](http://d.hatena.ne.jp/asin/B003STEHMW/hatena-blog-22)

うちがE-mobileのpocket wifiを使っててLANケーブルをさすところがなかったので、有線を無線で使えるようにするコンバータも買いました。

[![PLANEX 無線LANルータ/アクセスポイント/コンバータ「MZK-MF300N」「FFP-PKR01」専用 USB給電ケーブル SSOP-USB02](http://ecx.images-amazon.com/images/I/41D0lVfgD%2BL._SL160_.jpg "PLANEX 無線LANルータ/アクセスポイント/コンバータ「MZK-MF300N」「FFP-PKR01」専用 USB給電ケーブル SSOP-USB02")](http://www.amazon.co.jp/exec/obidos/ASIN/B0040ZO6H4/hatena-blog-22/)

[PLANEX 無線LANルータ/アクセスポイント/コンバータ「MZK-MF300N」「FFP-PKR01」専用 USB給電ケーブル SSOP-USB02](http://www.amazon.co.jp/exec/obidos/ASIN/B0040ZO6H4/hatena-blog-22/)

- 出版社/メーカー: プラネックス
- 発売日: 2010/09/10
- メディア: Personal Computers
- 購入: 8人 クリック: 40回
- [この商品を含むブログ (5件) を見る](http://d.hatena.ne.jp/asin/B0040ZO6H4/hatena-blog-22)

USBから給電するためのケーブル。

これらをつないでHerokuのサーバーにPOSTリクエストを送ると、node.jsがwebsocketを使ってグラフを更新するようにしました。

> arduinoからリクエストを受けてwebsocketでグラフを更新 [vine.co/v/bJ0j6W3gvz1](http://t.co/cXHadMjR "http://vine.co/v/bJ0j6W3gvz1")
> 
> — なおてぃー (@naoty\_k) [January 30, 2013](https://twitter.com/naoty_k/status/296625898378125312)

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

コードはこんなかんじ。

<script src="https://gist.github.com/naoty/4665115.js"></script>

上2つのコードを組み合わせると、圧力をPOSTでサーバーに送信できます。で、node.jsで書いたサーバーに送ると以下のような感じになりました。

> Demo [vine.co/v/bnn5muaq7T5](http://t.co/l0bNyY8a "http://vine.co/v/bnn5muaq7T5")
> 
> — なおてぃーさん (@naoty\_k) [2013年2月6日](https://twitter.com/naoty_k/status/299175115747381248)

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

arduinoのコードとサーバーのコードはともにgithubで公開しています。

[https://github.com/naoty/makura-arduino](https://github.com/naoty/makura-arduino)

[https://github.com/naoty/makura-web](https://github.com/naoty/makura-web)
