---
title: Fizzbuzz問題（Ruby） ver.1
time: 2010-08-16 11:18
tags: ['ruby']
---

　有名なFizzbuzz問題をRubyで解いてみました。Fizzbuzz問題とは、「1から任意の数までの自然数を表示せよ。ただし、3で割り切れる数は「Fizz」、5で割り切れる数は「Buzz」、両方で割り切れる数は「FizzBuzz」と表示すること。」というものです。  
　今回はRubyでやってみました。洗練された回答を出すために、2,3の新しい知識を得ました。非常に勉強になる問題だと思います。

```
def fizzbuzz(num)
	1.upto(num) do |i|
		x ||= i % 15 == 0 || i % 3 == 0 && "Fizz"
		x ||= i % 15 == 0 || i % 5 == 0 && "Buzz"
		puts x == true ? "FizzBuzz" : x || i
	end
end

fizzbuzz(ARGV[0].to_i)
```
