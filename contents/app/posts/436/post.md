---
title: ブロック引数の分割代入
time: 2021-01-23 13:40
tags: ['ruby']
---

まったく知らなくて驚いたので、以下のデータを例に試してみた。

```ruby
pokedex = [
  [1, 'Bulbasaur', ['Grass', 'Poisson']],
  [2, 'Ivysaur', ['Grass', 'Poisson']],
]
```

# 配列内の配列を分割代入

```ruby
pokedex.each do |id, name, types|
  puts "id:#{id} name:#{name} types:#{types}"
end
#=> id:1 name:Bulbasaur types:["Grass", "Poisson"]
#=> id:2 name:Ivysaur types:["Grass", "Poisson"]
```

# ネストした配列を分割代入

```ruby
pokedex.each do |id, name, (type1, type2)|
  puts "id:#{id} name:#{name} type1:#{type1} type2:#{type2}"
end
#=> id:1 name:Bulbasaur type1:Grass type2:Poisson
#=> id:2 name:Ivysaur type1:Grass type2:Poisson
```

`Enumerable#with_index`を使うときは特に便利。

```ruby
pokedex.each.with_index do |(id, name, (type1, type2)), index|
  puts "index:#{index} id:#{id} name:#{name} type1:#{type1} type2:#{type2}"
end
#=> index:0 id:1 name:Bulbasaur type1:Grass type2:Poisson
#=> index:1 id:2 name:Ivysaur type1:Grass type2:Poisson
```
