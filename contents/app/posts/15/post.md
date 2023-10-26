---
title: WIN32OLEを使ったExcelの操作(1)
time: 2010-08-23 19:26
tags: ['ruby']
---

　Excelの単調な作業をプログラミングを用いて一掃できたら、どんなに快適なことか。何時間も何日も、AからBへデータを入力しなおす作業をやらされてきた身としては、喉から手が出るほど欲しい技術なのです。現在勉強しているRubyを使って、Excelの操作方法を勉強していきます。  
　今回参考にさせていただいたサイトはこちらです。以下の内容はすべて、こちらのサイトで勉強したことをまとめただけなので、こちらを見ていただく方が早いと思います。

> [Rubyist Magazine - Win32OLE 活用法 【第 2 回】 Excel](http://jp.rubyist.net/magazine/?0004-Win32OLE)  
> [Rubyist Magazine - VBA より便利で手軽 Excel 操作スクリプト言語「Ruby」へのお誘い (前編)](http://jp.rubyist.net/magazine/?0027-ExcellentRuby)

　とりあえず、Excelファイルを読み込んでセル内のデータを表示させるソースコードはこんな感じになります。

```
require 'win32ole'

app = WIN32OLE.new('Excel.Application')
book = app.Workbooks.Open(app.GetOpenFilename)

begin
	book.ActiveSheet.UsedRange.Rows.each do |row|
		row.Columns.each do |cell|
			p cell.Address
			p cell.Value
			p '--'
		end
	end
ensure
	book.Close
	app.quit
end
```

　このソースコードがExcelを操作するプログラムとしては最もシンプルなものじゃないかと思います。今後の複雑な操作の際にも土台となる部分でしょう。なので、ひとつずつ見ていきます。

```
require 'win32ole'
```

　win32oleというライブラリを読み込んでいます。このライブラリによってExcelを初めMicrosoft社製品（Internet Explorerなど）をRubyで操作することが可能になります。このライブラリを読み込むことが必須となります。win32oleについては、こちらのサイトが非常に詳しく解説しています。

> [Rubyist Magazine - Win32OLE 活用法 【第 1 回】 Win32OLE ことはじめ](http://jp.rubyist.net/magazine/?0003-Win32OLE)

```
app = WIN32OLE.new('Excel.Application')
book = app.Workbooks.Open(app.GetOpenFilename)
```

　一行目でExcelを開き、二行目でExcelファイルを開いています。最後の「GetOpenFileName」を使うと、いつものファイルを開く画面が出てくるので好きなファイルを選択できます。パス名を取得する方法としては、これが一番簡単だと思います。また、ファイルを新規作成する場合は、「Open」ではなく「Add」とします。

```
book.ActiveSheet.UsedRange.Rows.each do |row|
	row.Columns.each do |cell|
```

　Excelのオブジェクトは「Application\>Workbook\>Worksheet\>Range」というモデル（COM）になっています。ActiveSheetはActiveなworksheetを指すWorksheetオブジェクト、UsedRangeもActiveなrangeを指すRangeオブジェクトです。そして、Rangeオブジェクトには、Rowsプロパティ、Columnsプロパティ、その次の行に出てくるAddressプロパティ、Valueプロパティなどがあり、より詳細なデータの中身を参照することが可能です。

```
book.Close
app.quit
```

　「begin〜ensure」のエラー処理をしておくと、エラーが起きても確実にExcelアプリケーションとExcelファイルを閉じておくことで問題を未然に防ぐことができます。こうした文法も必須です。
