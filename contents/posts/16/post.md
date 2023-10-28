---
title: Merge Sort ver.1
time: 2010-09-09 15:48
tags: ['ruby']
---

　ARGVでコマンドラインから引数を渡そうと思ったけど、flozenでslice!できませんよとエラーが出てきた。dupしても、なんかおかしなことになる。それが気になる。

```
def m_sort(array)
	if array.size == 1
		array
	else
		array1 = m_sort(array.slice!(0, array.size/2))
		array2 = m_sort(array)
		merge(array1, array2)
	end
end

def merge(array1, array2)
	merged_array = []
	(array1.size + array2.size).times do
		merged_array << array1.shift if !array1.empty? && (array2.empty? || array1.first <= array2.first)
		merged_array << array2.shift if !array2.empty? && (array1.empty? || array1.first > array2.first)
	end
	merged_array
end

p m_sort([9,32,4,10,3])
```

実行結果

```
C:\ruby>ruby m_sort.rb
[3, 4, 9, 10, 32]
```
