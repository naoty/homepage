---
title: 最近のテスト事情
time: 2013-01-19 01:14
tags: ['rspec']
---

むかしに比べると、かなりテストが書けるようになってきたし、TDDもだんだん慣れてきた。最近テスト書いてて便利だと思ったことについてメモっておく。

## スタブを使ってbefore\_filterをスキップする

```
describe 'GET index' do
  context 'ログインしている場合' do
    before(:each) do
      controller.any_instances.stub(:authenticate_user).and_return(true)
    end

    it 'hogehogeなfugafugaを取得する' do
      get index, params
      assigns[:fugafuga].should be_hogehoge
    end
  end
end
```

ログイン判定のような、リクエストをはじく処理を`before_filter`で実装することがよくあるけど、そういうコントローラーをテストする場合、スタブが便利だということにようやく気づいた。スタブによって、メソッドの中身をごまかして好きな値を返すようにできる。だから、`before_filter`をスキップしたい場合は、とにかくスタブして`true`を返すようにしとけばいい。`skip_before_filter`でもスキップすることはできるけど、僕はスタブを使う方が好み。

## FactoryGirlを使いこなす

```
FactoryGirl.define do
  factory :user do
    # 連番を使えばuniquenessのバリデーションにかからなくなる
    sequence(:name) {|n| "user #{n}" }
    sequence(:email) {|n| "user#{n}@example.com" }
    age { rand(18..30) }

    after(:build) do |user|
      # 余計なデータを作るコールバックがあればスキップできる
      User.skip_callback(:after, :create, :create_data)
    end

    # ネストしたfactoryで上書きできる
    factory :naoty do
      name 'naoty'
      email 'naoty@example.com'
      age 18
    end

    # traitで属性のグループに名前をつけられる
    trait :resigned do
      resigned_at { Time.now }
    end
  end
end

user = FactoryGirl.create(:user)
p user.name #=> "user 1"

naoty = FactoryGirl.create(:naoty)
p naoty.name #=> "naoty"

resigned_user = FactoryGirl.create(:user, :resigned)
p resigned_user.name #=> "user 2"
p resigned_user.resigned_at #=> "2013-01-19 00:43:59 +0900"
```

`factory_girl`はテスト用のデータを簡単につくるためのgem。似たようなgemは他にもあるけど、こういうgemを使うと、テストデータを作るロジックとテストコードを分離できる。なので、いろんなテストで使われるテストデータを重複なく簡単に作ることができる。

FactoryGirlでテストデータを作成するときに、よくひっかかるのがバリデーションや`after_save`などのコールバック内の余計な処理だと思う。こういう鬱陶しい処理は、FactoryGirlのコールバックを使ってスキップしてる。

`trait`は特殊なデータを作る場合にすごく役に立つ。上記の例のような「退会ユーザー」をテストに使いたいときなど、特殊なデータの属性をひとまとめにして`FactoryGirl.create(:user, :resigned)`のように簡単に作成できる。

## changeマッチャが便利

```
describe '#resign' do
  let(:user) { FactoryGirl.create(:user) }

  it 'resigned_atを更新する' do
    lambda {
      user.resign
    }.should change(user, :resigned?).from(false).to(true)
  end
end
```

モデルの更新系のメソッドをテストするとき、`change`マッチャが非常に便利。上の例で言うと、`user.resigned?`の結果がlambda内の処理を実行した前後で`false`から`true`に変わることをテストしている。
