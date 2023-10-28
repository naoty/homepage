---
title: ディレクトリ内のファイルの大きさを表示する
time: 2010-08-15 01:30
tags: ['ruby']
---

　指定されたディレクトリ内のファイルの大きさ（バイト）とその合計を表示するメソッドを作りました。コマンドを入力した瞬間にドバっと答えを返してくれるのが気持ちいいです。

```
require 'find'

def du(top)
	total_size = 0
	Find.find(top) do |path|
		if FileTest.file?(path)
			base = File.basename(path)
			size = File.size(path)
			puts "#{base}: #{size}"
			total_size += size
		end
	end
	puts "--", "Total: #{total_size}"
end

du(ARGV[0] || ".")
```
