---
title: 深すぎるcontextのネストを読みやすくする
time: 2021-06-27 20:56
tags: ["ruby", "test"]
---

今さらながら雰囲気でRSpecを書いているところがあったのでブログにしてみた。

テスト対象に影響を与えるパラメータが複数あると、テスト対象の値がとりうるパターンが膨大な組み合わせになる。例えば、あるパラメータ`a`がテスト結果に影響を及ぼしうるパターンが2つあり、さらにパラメータ`b`に2つパターンがあれば合計4パターンのテストが必要になる。

RSpecでは`context`をつかってテストの事前条件をスコープとして分割できるので、こういった組み合わせをネストされたスコープとして表現することになってしまう。

# ナイーブな実装
まずは何も考えずに`context`のネストによって事前条件の組み合わせを実装した例を載せる。このコードはそのまま一つのファイルとして実行可能になっている。

```ruby
require "bundler/inline"

gemfile do
  source "https://rubygems.org"

  gem "rspec"
end

require "rspec/autorun"

Something = Struct.new("Something") do
  def do_something(a:, b:)
    result = []
    result << a unless a.nil?
    result << b unless b.nil?

    result
  end
end

RSpec.configure do |config|
  config.formatter = :documentation
end

RSpec.describe Something do
  let(:instance) { described_class.new }

  describe "#do_something_with_arguments" do
    context "when a is nil" do
      let(:a) { nil }

      context "when b is nil" do
        let(:b) { nil }

        it "returns empty array" do
          result = instance.do_something(a: a, b: b)
          expect(result).to eq []
        end
      end

      context "when b isn't nil" do
        let(:b) { "b" }

        it "returns array containing value for b" do
          result = instance.do_something(a: a, b: b)
          expect(result).to eq [b]
        end
      end
    end

    context "when a isn't nil" do
      let(:a) { "a" }

      context "when b is nil" do
        let(:b) { nil }

        it "returns array containing value for a" do
          result = instance.do_something(a: a, b: b)
          expect(result).to eq [a]
        end
      end

      context "when b isn't nil" do
        let(:b) { "b" }

        it "returns array containing value for a and b" do
          result = instance.do_something(a: a, b: b)
          expect(result).to eq [a, b]
        end
      end
    end
  end
end
```

個人的には`subject { ... }`があまり好みじゃないので同じコードをあえて何度も書いている。

```
% ruby app.rb
Struct::Something
  #do_something_with_arguments
    when a is nil
      when b is nil
        returns empty array
      when b isn't nil
        returns array containing value for b
    when a isn't nil
      when b is nil
        returns array containing value for a
      when b isn't nil
        returns array containing value for a and b

Finished in 0.00539 seconds (files took 0.20052 seconds to load)
4 examples, 0 failures
```

上の例ではパラメータが2つしかないため、そこまでひどいネストにはならなかったが、現実世界ではパラメータはユーザーから渡されるパラメータやDBに保存されたデータの状態など無数に存在する。それらを愚直に`context`で実装するととんでもないことになる。

そんなことをする人はいないのもまた現実であり、テストすべきパラメータの組み合わせが網羅できているかがわからないあいまいなテストコードが生まれることになる。

# shared_contextをつかった実装
次に`shared_context`を使って事前条件を定義し、`context`内で`include_context`を複数回呼び出すことでそれらの組み合わせを実装する例を載せる。

```ruby
require "bundler/inline"

gemfile do
  source "https://rubygems.org"

  gem "rspec"
end

require "rspec/autorun"

Something = Struct.new("Something") do
  def do_something(a:, b:)
    result = []
    result << a unless a.nil?
    result << b unless b.nil?

    result
  end
end

RSpec.configure do |config|
  config.formatter = :documentation
end

RSpec.describe Something do
  let(:instance) { described_class.new }

  describe "#do_something_with_arguments" do
    shared_context "when a is nil" do
      let(:a) { nil }
    end

    shared_context "when a isn't nil" do
      let(:a) { "a" }
    end

    shared_context "when b is nil" do
      let(:b) { nil }
    end

    shared_context "when b isn't nil" do
      let(:b) { "b" }
    end

    context "when a and b is nil" do
      include_context "when a is nil"
      include_context "when b is nil"

      it "returns empty array" do
        result = instance.do_something(a: a, b: b)
        expect(result).to eq []
      end
    end

    context "when a is nil and b isn't nil" do
      include_context "when a is nil"
      include_context "when b isn't nil"

      it "returns array containing value for b" do
        result = instance.do_something(a: a, b: b)
        expect(result).to eq [b]
      end
    end

    context "when a isn't nil and b is nil" do
      include_context "when a isn't nil"
      include_context "when b is nil"

      it "returns array containing value for a" do
        result = instance.do_something(a: a, b: b)
        expect(result).to eq [a]
      end
    end

    context "when a and b isn't nil" do
      include_context "when a isn't nil"
      include_context "when b isn't nil"

      it "returns array containing value for a and b" do
        result = instance.do_something(a: a, b: b)
        expect(result).to eq [a, b]
      end
    end
  end
end
```

```
% ruby app.rb
Struct::Something
  #do_something_with_arguments
    when a and b is nil
      returns empty array
    when a is nil and b isn't nil
      returns array containing value for b
    when a isn't nil and b is nil
      returns array containing value for a
    when a and b isn't nil
      returns array containing value for a and b

Finished in 0.00564 seconds (files took 0.20556 seconds to load)
4 examples, 0 failures
```

`shared_context`で再利用可能な事前条件を定義し、`include_context`でそれを利用している。`include_context`は複数呼び出せるので、事前条件の組み合わせを親の`context`内で宣言でき、`context`が深くネストしていくような事態にはならなくなった。

この方法であれば、あるパラメータがとりうるパターンをそれぞれ`shared_context`で定義しておくことでどれだけ組み合わせが増えてもネストがこれ以上は深くならずテストコードの読みやすさを維持できると思う。

# 補足
そもそも、とりうるすべての組み合わせをテストすることはテスト全体の実行時間を遅らせることになる。必要十分なテストケースのみ列挙することで、テストとしての有効性を保ちつつこうしたデメリットを回避する方法もある。[以前の記事](/400/)ではそうしたテストケースの生成方法についてまとめたので参考になるかもしれない。
