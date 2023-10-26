---
title: count_letters ver.1
time: 2010-08-14 03:09
tags: ['ruby']
---

　文字列に含まれる文字数を文字ごとにカウントするメソッドを作成中です。"Ruby is an object oriented programming language"を例に実行すると、

'R': \*  
'u': \*\*  
'b': \*\*  
（以下に続く）

といった感じで表示されます。  
下のコードはやりかけですが、目下の問題は例えば「' ': \*\*\*\*\*\*」が一回表示されればいいものを六回表示されてしまうことです。さぁ、どうしたものか・・・。

```
def count_letters(str)
	ary = str.split(//)
	ary.each do |letter|
		result = str.scan(/(#{letter})/)
		print "'", letter, "': "
		result.count.times{print "*"}
		print "\n"
	end
end
p count_letters("Ruby is an object oriented programming language")
```
