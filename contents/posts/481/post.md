---
title: 外部キー制約によるデッドロックの再現
time: 2022-07-18 11:35
tags: ["mysql", "rails"]
---

デッドロックをテキストや図で理解するのはなかなか難しかったので、最小限のアプリケーションコードで再現できないか試してみた。こうすることで、実際に自分がデッドロックを引き起こすコードを書かないように注意できたり、同僚が書いたコードをレビューできるようになるだろう。

今回は見落としがちな外部キー制約がからむデッドロックを再現してみた。

再現にあたりなるべく簡潔に書けるようにRubyとActiveRecordを使い、デッドロックが起きたかどうかをテストによって検証する。以下のコードはローカルにMySQLが起動していれば動作する。

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
    t.datetime :last_tweeted_at
    t.datetime :last_followed_at
  end

  create_table :tweets do |t|
    t.string :body, null: false
    t.belongs_to :user, foreign_key: true
  end
end

class User < ActiveRecord::Base
  has_many :tweets
end

class Tweet < ActiveRecord::Base
  belongs_to :user
end

class MysqlTest < Minitest::Test
  def test_deadlock_by_foreign_keys
    assert_raises(ActiveRecord::Deadlocked) do
      user = User.create!(name: 'naoty')

      Thread.new do
        ActiveRecord::Base.transaction do
          # (1)外部キー制約により親テーブルのレコードに対して共有ロックを取得する
          user.tweets.create!(body: 'hello')
          sleep 1
          # (3)排他ロックを取得するため、(2)のロック解除待ち -> デッドロック
          user.update!(last_tweeted_at: Time.now)
        end
      end

      ActiveRecord::Base.transaction do
        sleep 1
        # (2)排他ロックを取得するため、(1)のロック解除待ち
        user.update!(last_followed_at: Time.now)
      end
    end
  end

  def test_avoid_deadlock_by_foreign_keys
    user = User.create!(name: 'naoty')

    Thread.new do
      ActiveRecord::Base.transaction do
        # (1)親テーブルのレコードに排他ロックを取得する
        user.lock!
        # (2)排他ロックを取得済み
        user.tweets.create!(body: 'hello')
        sleep 1
        # (4)排他ロックを取得済みなので、ロックの解除を待つ必要がない -> デッドロックは起きない
        user.update!(last_tweeted_at: Time.now)
      end
    end

    ActiveRecord::Base.transaction do
      sleep 1
      # (3)排他ロックを取得するため、(1)のロック解除待ち
      user.update!(last_followed_at: Time.now)
    end
  end
end
```

`#test_deadlock_by_foreign_keys`はデッドロックを再現させるテスト、`#test_avoid_deadlock_by_foreign_keys`はそれを避ける実装のテスト（例外が起きないテストは何もassertする必要がない）を表している。

比べてみると、子テーブルへのINSERTの前に親テーブルのレコードに排他ロックを取得しておくことで、デッドロックを回避できていることがわかる。

また、子テーブルを持つ親テーブルに`last_tweeted_at`や`last_followed_at`といった更新を必要とするカラムを定義すると、デッドロックを引き起こしやすいこともわかる。

---

今回は、外部キー制約が関わるデッドロックを再現してみたが、他のパターンについても同様の方法で再現させることでデッドロックについて理解を深めていきたい。
