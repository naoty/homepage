---
title: Grepコマンドもどき ver.1
time: 2010-10-02 15:13
tags: ['ruby']
---

　Railsで「この変数はどこで定義されているんだ？」と困ったときに、ディレクトリ以下のファイルすべてでパターンマッチをしたいです。なので、Grepコマンドもどきを作ってみました。

```
require 'find'

def grep(pattern, directory)
  Find.find(directory) do |path|
    if FileTest.file?(path)
      file = open(path)
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
c:\codes\rails\rails_apps\task/app/views/admin/tasks/show.html.erb: 3
c:\codes\rails\rails_apps\task/app/views/admin/tasks/show.html.erb: 8
c:\codes\rails\rails_apps\task/app/views/admin/tasks/show.html.erb: 13
c:\codes\rails\rails_apps\task/app/views/admin/tasks/show.html.erb: 17
c:\codes\rails\rails_apps\task/app/views/admin/tasks/new.html.erb: 5
c:\codes\rails\rails_apps\task/app/views/admin/tasks/index.html.erb: 8
c:\codes\rails\rails_apps\task/app/views/admin/tasks/edit.html.erb: 5
c:\codes\rails\rails_apps\task/app/views/admin/tasks/edit.html.erb: 26
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 16
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 20
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 27
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 31
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 37
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 43
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 46
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 48
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 49
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 52
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 60
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 63
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 65
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 69
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 77
c:\codes\rails\rails_apps\task/app/controllers/admin/tasks_controller.rb: 78
```

　ご覧の通り、修正しなきゃいけないのは出力するパス名が絶対パスになっているというところです。引数に渡したパスに対して相対パスにしたい。  
　でも、なんかうまくいかないんですよね。例えば

```
path = path.sub(Regexp.new(directory), '')
```

を加えてもダメでした。うまくいくと思ったんですが。

　なぜダメなのか、そして何かいいアイディアがありましたら、お願いします。
