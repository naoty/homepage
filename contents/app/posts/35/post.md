---
title: MechanizeでMixiボイスに投稿する
time: 2011-02-17 02:41
tags: ['ruby']
---

　RubyとMechanizeを使ってMixiボイスに投稿するプログラムを書きました。Mixiボイスに投稿するのはこれが初めてでしたｗ  
　このプログラムを実行するにはmechanizeをインストールする必要があります。

```
$ gem install mechanize
```

　で、プログラムはこんな感じ。

```
require 'rubygems'
require 'mechanize'

agent = Mechanize::new

puts "Login..."
page = agent.get "http://mixi.jp/"
form = page.forms[0]
form.email = "xxx@xxx"
form.password = "xxxxxxx"
agent.form.submit

puts "Post..."
page = agent.get "http://mixi.jp/home.pl"
form = page.forms[0]
form["body"] = "this voice is from a ruby program."
agent.form.submit

puts "Done"
```
