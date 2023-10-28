---
title: capistranoでのunicorn再起動タスク
time: 2012-03-12 22:45
tags: ['rails']
---

最低限こんなもんでいいんじゃね程度

```ruby:config/deploy.rb
namespace :deploy do
  task :start do
    run "bundle exec unicorn_rails -c #{current_path}/config/unicorn.rb -E production -D"
  end

  task :stop do
    run "kill -QUIT `cat #{current_path}/tmp/pids/unicorn.pid`"
  end

  task :restart do
    run "kill -USR2 `cat #{current_path}/tmp/pids/unicorn.pid`"
    run "kill -QUIT `cat #{current_path}/tmp/pids/unicorn.pid.oldbin`"
  end
end
```

```ruby:config/unicorn.rb
worker_processes 2
listen      File.expand_path('tmp/sockets/unicorn.sock', ENV['RAILS_ROOT'])
pid         File.expand_path('tmp/pids/unicorn.pid',     ENV['RAILS_ROOT'])
stdout_path File.expand_path('log/unicorn.log',          ENV['RAILS_ROOT'])
stderr_path File.expand_path('log/unicorn.log',          ENV['RAILS_ROOT'])
```
