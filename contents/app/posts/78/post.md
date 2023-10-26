---
title: factory_girlでdeviseのメール通知をスキップする
time: 2011-09-01 14:16
tags: ['rails']
---

```
Factory.define :user do |u|
  u.name 'naoty'
  u.email 'naoty.k@gmail.com'
  u.password 'naotynaoty'
  
  # skip confirmation
  u.confirmed_at Time.now
end
```

- deviseには確認メールの送信をスキップするskip\_confirmation!というメソッドがあるが、それをファクトリで使うことはできない。
- そこで、skip\_confirmation!の中身は以下のようになっているので、これを利用した。

```
def skip_confirmation!
  self.confirmed_at = Time.now
end
```
