---
title: Rubotyで勤務時間を管理する
time: 2015-03-13 22:10
tags: ['oss']
---

リモートワークのときでも勤務時間を自動的に記録するため、botに発言時間を監視させ、だいたいの勤務時間を記録させるようにした。

![f:id:naoty_k:20150313220454p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20150313/20150313220454.png "f:id:naoty\_k:20150313220454p:plain")

いま使っているbotは[r7kamura/ruboty](https://github.com/r7kamura/ruboty)製で、これに機能を追加するプラグインを書いた。

[naoty/ruboty-timecard](https://github.com/naoty/ruboty-timecard)

このプラグインは発言者ごとに発言時間を記録する。

[naoty/ruboty-google\_spreadsheet](https://github.com/naoty/ruboty-google_spreadsheet)

このプラグインは勤務時間のストレージを提供する。既存のストレージには[r7kamura/ruboty-redis](https://github.com/r7kamura/ruboty-redis)がある。これを利用する場合、保存された勤務時間を取得するコマンドを用意する必要がある。それを非エンジニアに理解してもらうのは厳しいと思ったので、直感的に理解できるGoogle Spreadsheetをストレージとして利用できるようにするプラグインを作った。

ソースコードを読むとわかるけど、この2つのプラグインは密結合しているため、設計上はいい出来とは言えない。ruboty-timecard内でruboty-google\_spreadsheetを使うことを想定したアクセスの仕方をしている。rubotyのストレージをうまく抽象化するインターフェイスがあると解決しそうだが、なかなか難しい問題だと思う。

[naoty/ruboty-timecard-template](https://github.com/naoty/ruboty-timecard-template)

これら2つのプラグインは共に使われることを想定しているため、勤務時間を記録する用のテンプレートを作った。Herokuボタンから簡単にデプロイできる。
