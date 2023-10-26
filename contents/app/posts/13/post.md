---
title: ハノイの塔　ver.1
time: 2010-08-19 08:08
tags: ['ruby']
---

　ハノイの塔を解くプログラムを作りました。かなり時間がかかりました。ずっとひっかかっていたところは、論理演算の初歩的なところでした。でも、そこに気づけてよかったです。これで論理演算は基礎が固まったかな。  
　3つの塔に見立てた配列から数値を出したり入れたりしています。どの配列から数値を取り出しどの配列に入れるかは全部で6パターンあり、それぞれについて4つの条件式を評価しています。  
　ただ、完成形が真ん中になってしまう場合も出てきてしまい、このプログラムは完璧とは言えません。また、この問題は再帰的プログラミングの典型例らしいので、この解き方は本筋ではないかもしれないです。

```
def tower(n)
	towers = [[], [], []]
	towers[0] = (1..n).to_a
	p towers
	puts "--"
	times = 0
	disks = []
	loop do
		if towers[0].first != disks.last && !towers[0].empty? &&
                 (towers[1].empty? || towers[0].first < towers[1].first)
			puts "towers[0] -> #{towers[0].first} -> towers[1]"
			disks << towers[0].first
			towers[1].unshift(towers[0].shift)
		elsif towers[0].first != disks.last && !towers[0].empty? &&
                    (towers[2].empty? || towers[0].first < towers[2].first)
			puts "towers[0] -> #{towers[0].first} -> towers[2]"
			disks << towers[0].first
			towers[2].unshift(towers[0].shift)
		elsif towers[1].first != disks.last && !towers[1].empty? &&
                    (towers[2].empty? || towers[1].first < towers[2].first)
			puts "towers[1] -> #{towers[1].first} -> towers[2]"
			disks << towers[1].first
			towers[2].unshift(towers[1].shift)
		elsif towers[1].first != disks.last && !towers[1].empty? &&
                    (towers[0].empty? || towers[1].first < towers[0].first)
			puts "towers[1] -> #{towers[1].first} -> towers[0]"
			disks << towers[1].first
			towers[0].unshift(towers[1].shift)
		elsif towers[2].first != disks.last && !towers[2].empty? &&
                    (towers[0].empty? || towers[2].first < towers[0].first)
			puts "towers[2] -> #{towers[2].first} -> towers[0]"
			disks << towers[2].first
			towers[0].unshift(towers[2].shift)
		elsif towers[2].first != disks.last && !towers[2].empty? &&
                    (towers[1].empty? || towers[2].first < towers[1].first)
			puts "towers[2] -> #{towers[2].first} -> towers[1]"
			disks << towers[2].first
			towers[1].unshift(towers[2].shift)
		end
		p towers
		puts "--"
		times += 1
		break if towers[2] == (1..n).to_a || towers[1] == (1..n).to_a
	end
	puts "total times: #{times}"
end

tower(ARGV[0].to_i)
```
