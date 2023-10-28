---
title: モデルに記述する順番
time: 2017-12-02T23:02:00+0900
description: Railsでモデルに記述する順番について考えてみた
tags: ["rails"]
---

他のメンバーがコードを読むときに知っておいてほしいことを意識して、以下の順に書いている。

1. モジュール
2. 定数
3. 関連
4. 属性（`enum`, `attribute`など）
5. コールバック
6. バリデーション
7. スコープ
8. クラスメソッド
9. インスタンスメソッド
10. プライベートメソッド

以下のコードは例のために書いてみたけど、動くかわからない。

```ruby
class Pokemon < ApplicationRecord
  include Tradable

  INITIAL_HP_RANGE = 10..20

  belongs_to :master
  has_many :skills

  enum gender: %i[male female]

  before_validation :set_initial_hp, on: :create

  validates :name, presence: true
  validates :hp, numericality: { greater_than_or_equal_to: 0 }

  scope :first_generation, -> { where(id: (1..151).to_a) }

  def self.capture
    # ...
  end

  def attack
    # ...
  end

  private

  def set_initial_hp
    self.hp = rand(INITIAL_HP_RANGE)
  end
end
```
