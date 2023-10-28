---
title: factory_girlを使ってスマートにseedデータを作成する
time: 2011-10-30 20:24
tags: ['rails']
---

> 環境
> 
> - rails 3.1.1
> - factory\_girl 2.2.0

　requireでfactory\_girlとfactoryファイルすべてを読み込むと、seeds.rbでもfactory\_girlが使えます。seeds.rbでfactory\_girlを使うのは、テストと同じデータをブラウザでも確認できる、seeds.rbを非常に簡潔に書くことができる、といった利点があります。

以下の例では、このようなデータを作成する例です。

- 特定のユーザーを含む6人のUserインスタンスを作成
- 100件のArticleインスタンスを作成
- 100件のArticleインスタンスはそれぞれ、6人のうち1つのuser\_idをランダムにふられる

db/seeds.rb

```
require 'factory_girl'
Dir[Rails.root.join('spec/support/factories/*.rb')].each {|f| require f }

User.delete_all
Article.delete_all

FactoryGirl.create(:naoty)
FactoryGirl.create_list(:user, 5)
FactoryGirl.create_list(:article, 100)
```

spec/support/factories/users.rb

```
FactoryGirl.define do
  factory :user do
    sequence(:name) {|n| "user #{n}" }
  end

  factory :naoty do
    name 'naoty'
  end
end
```

spec/support/factories/articles.rb

```
FactoryGirl.define do
  factory :article do
    sequence(:title) {|n| "sample title #{n}" }
    user_id { User.all.to_a.map(&:id).sample }
  end
end
```

```
naoty$ rake db:seed
```
