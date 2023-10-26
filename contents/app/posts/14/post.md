---
title: ハノイの塔　ver.2
time: 2010-08-21 10:00
tags: ['ruby']
---

　円盤がN枚のときの[ハノイの塔](http://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%8E%E3%82%A4%E3%81%AE%E5%A1%94)を完全に攻略することができました。前回のものを再帰的手法を用いて洗練させました。  
　@towersは3つの塔を配列として表現したもの（@towers[0]が左、@towers[1]が真ん中、@towers[2]が右の塔）、timesは円盤を移動させた回数、nは円盤の枚数、startは最初に円盤が積んである塔の番号、goalは円盤を積んで完成させる塔の番号、tempはそのどちらでもない一時的に円盤を積んでおく塔の番号（start, goal, tempは0, 1, 2のどれかをとる）、をそれぞれ指します。  
　ハノイの塔の攻略法は、「n-1枚のハノイの塔を別に作って、n枚目の円盤を右側の塔に移し、その上に再度n-1枚のハノイの塔を作る」というものです。さらに、n-1枚のハノイの塔を作るには、n-2枚のハノイの塔をまたどこかに作って、n-1枚目の円盤をどこかに移し、n-2枚のハノイの塔をその上に作ることが必要です。これが「n-3, n-4,...,1」と続くわけです。数学の漸化式のような発想です。

```
@towers = [(1..ARGV[0].to_i).to_a, [], []]
@times = 0

def hanoi(n, start, goal)
	temp = 3 - start - goal
	if n == 1
		@towers[goal].unshift(@towers[start].shift)
		result
	else
		hanoi(n - 1, start, temp)
		@towers[goal].unshift(@towers[start].shift)
		result
		hanoi(n - 1, temp, goal)
	end
end

def result
	p @towers
	puts "--"
	@times += 1
end

hanoi(ARGV[0].to_i, 0, 2)
puts "total times: #{@times}"
```

実行結果

```
c:\codes\ruby\exercise>ruby hanoi.rb 3
[[2,3],[],[1]]
--
[[3],[2],[1]]
--
[[3],[1,2],[]]
--
[[],[1,2],[3]]
--
[[1],[2],[3]]
--
[[1],[],[2,3]]
--
[[],[],[1,2,3]]
--
total times: 7
```
