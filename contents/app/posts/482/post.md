---
title: DELETEの空振りによるデッドロック
time: 2022-07-24 21:30
tags: ["mysql"]
---

[前回](/481/)に続いて、今回はDELETEの空振りによってデッドロックが発生するケースをテストコードによって再現させてみる。

```ruby
require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'

  gem 'minitest'
  gem 'activerecord', require: 'active_record'
  gem 'mysql2'
end

require 'minitest/autorun'
require 'logger'

ActiveRecord::Base.logger = Logger.new(STDOUT)

config = { adapter: 'mysql2', host: '127.0.0.1', username: 'root', password: 'password' }
ActiveRecord::Base.establish_connection(config)
ActiveRecord::Base.connection.recreate_database('mysql_test')
ActiveRecord::Base.establish_connection(config.merge({ database: 'mysql_test' }))

ActiveRecord::Schema.define do
  create_table :users do |t|
    t.string :name, null: false
    t.index :name
  end
end

class User < ActiveRecord::Base
end

class DeadlockTest < Minitest::Test
  def teardown
    User.delete_all
  end

  def test_deadlock
    assert_raises(ActiveRecord::Deadlocked) do
      Thread.new do
        User.transaction do
          # (1)suprenumのネクストキーロックを取得する
          User.delete_by(name: 'naoty')
          sleep 1
          # (3)挿入インテンションロックを取得するため、(2)のロック解除待ち
          User.create!(name: 'naoty')
        end
      end

      User.transaction do
        sleep 1
        # (2)suprenumのネクストキーロックを取得する
        User.delete_by(name: 'naoty')
        sleep 1
        # (4)挿入インテンションロックを取得するため、(1)のロック解除待ち -> デッドロック
        User.create(name: 'naoty')
      end
    end
  end

  def test_avoid_deadlock
    User.create!(name: 'naoty')

    Thread.new do
      User.transaction do
        User.delete_by(name: 'naoty')
        sleep 1
        User.create!(name: 'naoty')
      end
    end

    User.transaction do
      sleep 1
      User.delete_by(name: 'naoty')
      sleep 1
      User.create(name: 'naoty')
    end
  end
end
```

`DELETE`の条件に一致するレコードがない場合、条件の値を含む区間に対してギャップロックが取得される（[参考](/446/)）。今回のように1件もレコードがない場合や指定した値が最大の値より大きい場合は`suprenum`に対するネクストキーロックになる。ギャップロックはINSERTを停止させるものの、ギャップロック同士では影響を与えないため（[参考](https://dev.mysql.com/doc/refman/5.6/ja/innodb-record-level-locks.html)）、2回目の`DELETE`がロック取得待ちになることはない。その結果、2つのトランザクションで`INSERT`がギャップロックによってロック取得待ちになり、デッドロックが発生する。

`#test_avoid_deadlock`のように条件に一致するレコードがあった場合、セカンダリインデックスのマッチしたレコードに対してネクストキーロックを取得する。つまり、マッチしたレコードの前にギャップロックを取得するため、条件と同じ値の`INSERT`はロック取得待ちにならずに成功する。
