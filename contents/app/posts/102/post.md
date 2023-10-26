---
title: Railsで時間を「◯分前」「◯時間前」にフォーマットする
time: 2012-03-01 19:41
tags: ['rails']
---

```ruby:config/initializers/time_formats.rb
# coding: UTF-8
Time::DATE_FORMATS[:human] = lambda {|date|
  seconds = (Time.now - date).round;
  days    = seconds / (60 * 60 * 24); return "#{date.month}月#{date.day}日" if days > 0;
  hours   = seconds / (60 * 60);      return "#{hours}時間前" if hours > 0;
  minutes = seconds / 60;             return "#{minutes}分前" if minutes > 0;
  return "#{seconds}秒前"
}
```

```ruby
naotyA = User.create(:created_at => Time.now - 5.minutes)
naotyB = User.create(:created_at => Time.now - 5.hours)
naotyC = User.create(:created_at => Time.now - 5.days)
naotyA.created_at.to_s(:human) #=> "5分前"
naotyB.created_at.to_s(:human) #=> "5時間前"
naotyC.created_at.to_s(:human) #=> "2月25日"
```
