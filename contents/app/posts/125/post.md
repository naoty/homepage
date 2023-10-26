---
title: gemをすべてアンインストールするワンライナー
time: 2012-05-25 15:16
tags: ['ruby']
---

rvmでは以前のでうまくいったけど、rbenvでうまくいかなかったので改良しました。

```ruby:gem_uninstall_all
#!/usr/bin/env ruby

gem_list = `gem list --no-version`
gem_list.each_line do |line|
  next if line.empty? || /LOCAL GEMS/ =~ line
  system "gem uninstall -axI #{line}"
end
```
