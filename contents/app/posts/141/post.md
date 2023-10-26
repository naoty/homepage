---
title: FactoryGirlでコールバックをスキップする
time: 2012-09-04 11:53
tags: ['rails']
---

FactoryGirlでテストデータを作るとき、`before_create`などのコールバックも実行されて、いろいろめんどくさいときがある。

```ruby
FactoryGirl.define do
  factory :user do
    name 'naoty'
    age  18

    after(:build) do
      User.skip_callback(:create, :before, :hoge_method, :fuga_method)
    end
  end
end
```

- `skip_callback`はメソッドごとにスキップするか設定できる。
- 似たようなものに`reset_callbacks`があるけど、これはイベントに設定されてるコールバックメソッドの**すべて**をスキップする。
- `after(:build)`のところはスキップしたいコールバックのタイミングによって、調整する必要あると思う。

---

### バージョン
- factory_girl (3.3.0)
- factory_girl_rails (3.3.0)

---

### 参考
- [skip_callback](http://apidock.com/rails/ActiveSupport/Callbacks/ClassMethods/skip_callback)
- [reset_callbacks](http://apidock.com/rails/v3.2.8/ActiveSupport/Callbacks/ClassMethods/reset_callbacks)
