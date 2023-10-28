---
title: Time::DATE_FORMATS
time: 2011-11-13 23:58
tags: ['ruby']
---

```ruby:config/initializers/time_formats.rb
Time::DATE_FORMATS[:simple_time]     = lambda {|time| time = time.to_datetime; "#{time.hour}:#{sprintf('%02d', time.minute)}" }
Time::DATE_FORMATS[:simple_datetime] = lambda {|time| time = time.to_datetime; "#{time.month}/#{time.day} #{time.hour}:#{sprintf('%02d', time.minute)}" }
```
```ruby
user.created_at.to_s(:simple_time)     #=> "0:00"
user.created_at.to_s(:simple_datetime) #=> "11/14 0:00"
```
