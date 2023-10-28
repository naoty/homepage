---
title: ちゃんとテスト書き始めた話
time: 2012-09-27 02:47
tags: ['rspec']
---

## テストのモチベ＝怖いからやる

- 正直に白状すると、「これまでテスト書いたことない && 会社にテストの文化がない && テスト書いてる時間ない」っていう状況で、時間を割いてでもテストを書こうっていうモチベがなかなか湧かなかった。
- そんななか、唯一、ハッキリとしたわかりやすいモチベは「デグレが怖い」という恐怖心から解放されることだった。
- プロジェクトが大きくなるほど、自分が書いたコードがどこまで影響するか把握できなくなってくる。だからといって、変更のたびにブラウザでポチポチ一個ずつ確認する作業はだるい。
- テストが通ってるという事実が抜群の安心感をもたらすことがわかってきて、ちゃんとテストを書くようになったというお話です。

## 500返ってないか怖い

- 一番わかりやすいテスト項目として「ユーザーにエラー画面を表示していないか」というのがまずアタマに浮かんだ。
- モデルとか変更すると、影響範囲よくわからないし、怖い。
- 手っ取り早く全部のアクションで500返ってないかテストする方法を考えてみた。
- `response.should be_success`的なレスポンスをチェックするテストにタグをつけて、全コントローラーをまたいでレスポンスをチェックするテストだけを実行するってやり方を考えてみた。全コントローラーのテストは時間かかって、たぶん手元では試さなくなりそうだから。

```
# spec/spec_helper.rb

RSpec.configure do |config|
  config.treat_symbols_as_metadata_keys_with_true_values = true
end
```

- RSpec 2.xだとこの設定が必要らしい。
- `it 'hogehoge', status: true`みたいなのを`it 'hogehoge', :status`で書けるようになる。

```
# lib/tasks/spec/status.rake

require 'rspec/core/rake_task'

namespace :spec do
  namespace :controller do
    RSpec::Core::RakeTask.new(:status) do |spec|
      spec.pattern = 'spec/controllers/**/*_spec.rb'
      spec.rspec_opts = '--tag status'
    end
  end
end
```

- 自分で`rake spec:controllers`的なテストのraketaskを定義したいときは`RSpec::Core::RakeTask.new(:hoge)`使えばいいっぽい。
- 全コントローラーのテストで、`status`ってタグがついてるものだけ実行したいので、こんな感じ。

```
it 'returns successfully', :status do
  get :index
  response.should be_success
end
```

```
$ rake spec:controllers:status
```

- これでコントローラーをまたいで`status`タグのついたテストだけ実行できる。
- 全コントローラーのテストは重すぎるので、これでかなり気軽にチェックできるようになると思う。
- とりあえずステータスコードをチェックするようなテストに`status`タグをつけておく、っていうルールを共有する必要はある。

## スクリプトでDBを更新するの怖い

- ちょっと前に顧客のデータぜんぶ消しちゃった事件があったような気がする。
- ああいうのあるし、DBを更新する系のスクリプトはちゃんとテストしたい。
- 仕事では`rails r`でスクリプトを実行するんだけど、こういうのはどうやってテストすればいいのかわからなかったので調べたり試行錯誤した。

```
# config/environments/test.rb

NaotySample::Application.configure do
  $LOAD_PATH.unshift "#{Rails.root}/script"
end
```

- `script/`以下を`require`するためにパスに追加しておく

```
# spec/scripts/create_naoty_spec.rb

require 'spec_helper'
require 'create_naoty'

describe CreateNaoty do
  it 'creates naoty' do
    CreateNaoty.run
    User.where(name: 'naoty').first.should be_present
  end
end
```

- スクリプトを読み込んでテスト内で実行する。
- モジュールのテストとたぶん同じやり方だと思う。やったことないけど。

```
# script/create_naoty.rb

module CreateNaoty
  def self.run
    User.create(name: 'naoty')
  end
end

CreateNaoty.run if __FILE__ == $0
```

- 処理の中身をモジュールにまとめておいて、テスト内で実行しやすくしておく。
- `if __FILE__ == $0`で`require`されたときにスクリプトが実行されるのを回避してる。

```
# Guardfile

guard 'rspec' do
  watch(%r{^script/(.+)\.rb$}) {|m| "spec/scripts/${m[1]}_spec.rb" }
end
```

- Guardを使って自動テストをやってるので、スクリプトテスト用の設定を追加しておく。
- これでスクリプトを変更したときに、それのテストを自動で実行するようになる。

## まとめ

- 「怖いからテストする」というモチベはわかりやすい。
- 「怖いところをテストする」という方針であれば、「何をテストすべきか」を自ずと意識するようになる。
- rspec-railsで対応できなければ、rspecの便利機能を駆使して試行錯誤する。RSpec bookにお世話になってる。

## 参考

[![The RSpec Book (Professional Ruby Series)](http://ecx.images-amazon.com/images/I/51-3T735zLL._SL160_.jpg "The RSpec Book (Professional Ruby Series)")](http://www.amazon.co.jp/exec/obidos/ASIN/4798121932/hatena-blog-22/)

[The RSpec Book (Professional Ruby Series)](http://www.amazon.co.jp/exec/obidos/ASIN/4798121932/hatena-blog-22/)

- 作者: David Chelimsky,Dave Astels,Zach Dennis,角谷　信太郎,豊田　祐司,株式会社クイープ
- 出版社/メーカー: 翔泳社
- 発売日: 2012/02/22
- メディア: 大型本
- 購入: 5人 クリック: 112回
- [この商品を含むブログ (12件) を見る](http://d.hatena.ne.jp/asin/4798121932/hatena-blog-22)

- [http://blog.davidchelimsky.net/2011/11/06/rspec-280rc1-is-released/](http://blog.davidchelimsky.net/2011/11/06/rspec-280rc1-is-released/)
