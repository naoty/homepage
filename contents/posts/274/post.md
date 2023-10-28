---
title: Rakeタスクの賢いロギング
time: 2015-10-11 12:41
tags: ['rails']
---

# やりたいこと
* すべてのRakeタスクの前後で、開始と終了のメッセージを表示したい。
* 毎回出るのは鬱陶しいので、指定したときだけ表示したい。
* いろんなところに`p`とか`Rails.logger.info`のような処理を書きたくない。

# 実装

```ruby:lib/tasks/setup_account.rake
desc "Setup an account"
task setup_account: %i(common) do
  logger.debug "creating account..."
  logger.info  "created account!"
end
```

```ruby:lib/tasks/common.rake
# Extend logger to the main object
def logger
  Rails.logger
end

desc "Setup a common setting for every tasks"
task common: %i(environment) do
  Rails.logger = Logger.new(STDOUT)
  Rails.logger.level = Logger::INFO
end

desc "Switch the level of a logger to DEBUG"
task debug: %i(common) do
  Rails.logger.level = Logger::DEBUG
end

require "task_logging"
```

```ruby:lib/task_logging.rb
module TaskLogging
  def task(*args, &block)
    Rake::Task.define_task(*args) do |task|
      if block_given?
        Rails.logger.debug "[#{task.name}] started"
        begin
          block.call(task)
          Rails.logger.debug "[#{task.name}] finished"
        rescue => exception
          Rails.logger.debug "[#{task.name}] failed"
          raise exception
        end
      end
    end
  end
end

# Override Rake::DSL#task to inject logging
extend TaskLogging
```

上のように実装すると、以下のように賢くログを出し分けられる。

```zsh
$ rake setup_account
I, [2015-10-10T17:38:58.192968 #15178]  INFO -- : created account!
$ rake debug setup_account
D, [2015-10-10T17:38:00.704398 #11753] DEBUG -- : [setup_account] started
D, [2015-10-10T17:38:00.704460 #11753] DEBUG -- : creating account...
I, [2015-10-10T17:38:00.704478 #11753]  INFO -- : created account!
D, [2015-10-10T17:38:00.704491 #11753] DEBUG -- : [setup_account] finished
```
