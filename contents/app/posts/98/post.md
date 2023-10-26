---
title: capistranoでtail -f
time: 2012-01-17 23:01
tags: ['ruby']
---

```ruby:config/deploy.rb
namespace :logging do
  task :tail_unicorn do
    run "tail -f #{shared_path}/log/unicorn.log" do |channel, stream, data|
      trap("INT") { puts "Interupted!"; exit 0; }
      puts "=== #{channel[:host]} ==="
      puts data
      break if stream == :err
    end
  end
end
```
[StackOverflowの投稿](http://stackoverflow.com/questions/5218902/tail-production-log-with-capistrano-how-to-stop-it)のほぼコピペですが、非常に便利なので共有です。
