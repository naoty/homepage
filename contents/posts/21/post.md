---
title: Grepコマンドもどき ver.2（完成版）
time: 2010-10-02 18:10
tags: ['ruby']
---

　Twitterでアドバイスを募ったところ、解決策が見つかったので、さっそく記録します。完成版のコードはこちら。

```
require 'find'

def grep(pattern, directory)
  Find.find(directory) do |path|
    if FileTest.file?(path)
      file = open(path)
      path = File.expand_path(path).sub(Regexp.new(File.expand_path(directory)), '')
      while line = file.gets
        puts "#{path}: #{file.lineno}" if line =~ pattern
      end
      file.close
    end
  end
end

grep(Regexp.new(ARGV[0]), ARGV[1])
```

実行結果

```
C:\codes\ruby>ruby grep.rb @task c:\codes\rails\rails_apps\task
/app/views/admin/tasks/show.html.erb: 3
/app/views/admin/tasks/show.html.erb: 8
/app/views/admin/tasks/show.html.erb: 13
/app/views/admin/tasks/show.html.erb: 17
/app/views/admin/tasks/new.html.erb: 5
/app/views/admin/tasks/index.html.erb: 8
/app/views/admin/tasks/edit.html.erb: 5
/app/views/admin/tasks/edit.html.erb: 26
/app/controllers/admin/tasks_controller.rb: 16
/app/controllers/admin/tasks_controller.rb: 20
/app/controllers/admin/tasks_controller.rb: 27
/app/controllers/admin/tasks_controller.rb: 31
/app/controllers/admin/tasks_controller.rb: 37
/app/controllers/admin/tasks_controller.rb: 43
/app/controllers/admin/tasks_controller.rb: 46
/app/controllers/admin/tasks_controller.rb: 48
/app/controllers/admin/tasks_controller.rb: 49
/app/controllers/admin/tasks_controller.rb: 52
/app/controllers/admin/tasks_controller.rb: 60
/app/controllers/admin/tasks_controller.rb: 63
/app/controllers/admin/tasks_controller.rb: 65
/app/controllers/admin/tasks_controller.rb: 69
/app/controllers/admin/tasks_controller.rb: 77
/app/controllers/admin/tasks_controller.rb: 78
```

　ブラボー！！  
　どうやらうまくいかなかった原因は、subの中でマッチングされずうまくパス名が変換できなかったからのようですね。

```
path = File.expand_path(path).sub(Regexp.new(File.expand_path(directory)), '')
```

　こうしておけば、確実にマッチングできます。うん、Twitterいいね。

　アドバイスいただいた方、ありがとうございました。
