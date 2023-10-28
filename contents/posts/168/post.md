---
title: Object#freezeについて
time: 2013-01-17 18:29
tags: ['ruby']
---

```ruby
DAYS = ['日', '月', '火', '水', '木', '金', '土']
DAYS << '日'
p DAYS
#=> ["日", "月", "火", "水", "木", "金", "土", "日"]
```

- 定数のArrayやHashでも中身を簡単に書きかえられてしまう。ゆるふわな感じがする。
- こんな定数はイヤだ。

```ruby
DAYS = ['日', '月', '火', '水', '木', '金', '土'].freeze
DAYS << '日'
p DAYS
#=> /Users/naoty/workspace/misc/freeze_sample.rb:3:in `<main>': can't modify frozen Array (RuntimeError)
```

- `Object#freeze`を使うと、オブジェクトの中身を変更できなくなる（ただし、オブジェクトそのものを再代入することは可能）。
- こっちの方が定数っぽい感じがする。
