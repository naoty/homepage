---
title: Head First Cの感想
time: 2013-04-29 14:18
tags: ['book', 'c']
---

以前参加したmrubyの勉強会でC言語でコードを書く機会があってよくわからなかったので、オススメされた「Head First C」を読んでみた。

[![Head First C ―頭とからだで覚えるCの基本](http://ecx.images-amazon.com/images/I/51x05Kg9MFL._SL160_.jpg "Head First C ―頭とからだで覚えるCの基本")](http://www.amazon.co.jp/exec/obidos/ASIN/4873116090/hatena-blog-22/)

[Head First C ―頭とからだで覚えるCの基本](http://www.amazon.co.jp/exec/obidos/ASIN/4873116090/hatena-blog-22/)

- 作者: David Griffiths,Dawn Griffiths,中田秀基(監訳),木下哲也
- 出版社/メーカー: オライリージャパン
- 発売日: 2013/04/03
- メディア: 大型本
- [この商品を含むブログを見る](http://d.hatena.ne.jp/asin/4873116090/hatena-blog-22)

500ページ超あるんだけどすごくわかりやすくて10日間で読み終わった。Head FirstシリーズはRailsなどいろいろあるのは知ってたけど読んだことなかった。どうやらこのシリーズは科学的なアプローチで分かりやすく書いているみたいで、確かにわかりやすかった。C言語の入門書というとすごい古い本や固っくるしい本が多いような印象があるけど、この本は今月発売されたばかりでかつカジュアルだったので、とっかかりやすかった。

内容は`main()`とかポインタから始まって、最後はマルチプロセスのwebサーバーを作ったりマルチスレッドプログラミングを扱うところまでカバーしてる。やっぱりポインタが鬼門で、何度も読み返したけど80%くらいの理解。文字列ポインタとか配列変数とかで？？？ってなった。それ以外は本当にわかりやすくてよかった。特にメモリ管理のところはわかりやすかった。普段Rubyとか書いてるとあまりメモリのことは考えないけど、スタックとヒープの区別がついたり、valgrindを使ってメモリリークを調べたりすることでだいぶメモリに対する意識が高まった。また、gccでコンパイルしたりリンクをひとつひとつ丁寧にやることでmakeの有難みを感じた。iOSアプリを開発するとたまに出てくるスタティックリンクライブラリ（lib\*.aみたいなの）の正体もわかってよかったし、今後iOSアプリのビルドに失敗しても怯えなくて済みそう。あと、途中のコラムでOpenCVについて簡単な説明があってちょっと興味がわいてきた。Raspberry Piとウェブカメラを買ってOpenCVで遊んでみたいと思った。
