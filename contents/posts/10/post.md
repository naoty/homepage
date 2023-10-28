---
title: count_letters ver.2
time: 2010-08-14 03:33
tags: ['ruby']
---

　Array#uniqで重複を削除した配列に対してArray#eachでループさせたところ、問題は無事解決されました。ただ、実行すると最後にこの配列が表示されるのが気になる。なんでだろう？

```
def count_letters(str)
	ary = str.split(//)
	ary.uniq!
	ary.each do |letter|
		result = str.scan(/(#{letter})/)
		print "'", letter, "': "
		result.count.times{print "*"}
		print "\n"
	end
end

p count_letters("Ruby is an object oriented programming language")
```
