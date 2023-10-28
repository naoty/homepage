---
title: 脱初心者なRubyのループ処理の書き方
time: 2011-07-26 23:51
tags: ['ruby']
---

合計を計算する場合

```
# 初心者
count = 0
(1..10).each {|n| count += n}
p count

# 脱初心者
p (1..10).inject(0) {|count, n| count + n}
```

配列に特定の要素をいれる

```
# 初心者
users = []
[1,2,3,4,5].each do |n|
  users << User.find(n) if n > 3
end

# 脱初心者
users = [1,2,3,4,5].select {|n| n > 3}.collect {|n| User.find(n)}
```

eachループをinject, collect(map), selectで書き換えると、スッキリしてカッコイイ。

- -

追記

```
# 以下同じ
p (1..10).inject(0) {|count, n| count + n}
p (0..10).inject {|count, n| count + n}
p (1..10).inject(:+)
```
