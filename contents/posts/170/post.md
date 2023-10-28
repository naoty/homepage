---
title: Railsに組み込むgemを作るためのTips
time: 2013-01-20 12:27
tags: ['rails']
---

[params\_inquirer](https://github.com/naoty/params_inquirer)というgemを作りました。何ができるかと言うと、文で説明するのがなかなか難しいので、下のコードを見てください。

```
# users_controller.rb

def index
  if params[:status].accepted? # params[:status] == 'accepted' と同じ
    @users = User.accepted
  elsif params[:status].rejected? # params[:status] == 'rejected' と同じ
    @users = User.rejected
  else
    @users = User.all
  end
end
```

params\_inquirerを使うと上の`accepted?`のようなメソッドが`params`に対して呼べるようになります。すでにrubygemsで公開してるので、ちょっと試してみたい場合は、irbで試してもらうこともできます。

```
$ gem install params_inquirer
$ irb
irb > require 'params_inquirer'
irb > params = ParamsInquirer::Parameters.new({ name: 'naoty' })
irb > params[:name].naoty?
 => true
```

`params`の中身を文字列で比較するのがなんとなくダサいと感じていたので、作ってみました。あとは、Railsの中身について勉強してみたかったというのもあります。

Railsに組み込みgemを作るにあたって知っておいた方がいいポイントについてまとめてみます。

## Bundlerでgemのひな形を作る

gemを作るとき、まず最初にBundlerを使ってgemのひな形を作ります。

```
$ gem install bundler
$ bundle gem params_inquirer
```

これでgemのひな形ができます。作ったgemをローカル環境にインストールしたりrubygems.orgにリリースするためのRaketaskもここに含まれるので、かなり便利です。

Bundlerを使ったgemの開発については[この記事](http://ja.asciicasts.com/episodes/245-new-gem-with-bundler)を参考にしました。

## Railtie

Railtieは、Railsを起動するときにgemのコードを`ActionController::Base`に`include`させるために使いました。これによって、自分のgemをRailsアプリケーションに組み込むことができます。

下のコードでは、Railsプロセスが起動するときに`initializer`ブロック内の処理が実行されて、自分で作った`ParamsInquirer::ActionController::Base`が`ActionController::Base`に`include`されるようになります。

```
# lib/params_inquirer/railtie.rb

require 'params_inquirer/action_controller/base'

module ParamsInquier
  class Railtie < ::Rails::Railtie
    initializer 'Initialize params_inquirer' do
      ::ActionController::Base.send :include, ParamsInquirer::ActionController::Base
    end
  end
end
```

ただ、このファイルがRails起動時に`require`されている必要があります。

インストールされたgemを`require`するとき`lib/<gem_name>.rb`が`require`されます。このgemであれば`lib/params_inquirer.rb`です。なので、ここでrailtieを`require`しておく必要があります。

```
# lib/params_inquirer.rb

if defined?(Rails)
  require 'lib/params_inquirer/railtie'
else
  require 'lib/params_inquirer/parameters'
end
```

`require 'params_inquirer'`が実行されるとこのファイルが実行されます。もしRailsアプリケーション内であればrailtieを`require`し、最初に見せたirbのような場合は必要なファイルだけ`require`するようにしています。

以上のようすることで、Rails起動時にrailtieを`require`しrailtieから自分で作ったコードをRailsアプリケーション内に`include`させることができました。

## ActiveSupport::Concern

ここからは実際に使ったというよりは、actionpackやactivesupportなどのgemを読んでいくときに必要になったtipsです。

`include`したモジュールを使ってクラスメソッドをmixinしたい場合、下のように`Module#.included`をオーバーライドしその中で内部モジュールを`extend`するテクニックが定石みたいです。

```
module M
  def self.included(base)
    # extendによってクラスメソッドとしてmixinされる
    base.extend ClassMethods
    scope :disabled, where(disabled: true)
  end

  # クラスメソッドを定義する内部モジュール
  module ClassMethods
    ...
  end
end
```

上のようなコードは`ActiveSupport::Concern`を使うと下のように書けます。

```
module M
  extend ActiveSupport::Concern

  included do
    scope :disabled, where(disabled: true)
  end

  module ClassMethods
    ...
  end
end
```

一見すると、`ClassMethods`モジュールが`extend`されていないように見えますが、内部的に`ClassMethods`という名前のモジュールが`extend`されます。「設定より規約」に従ってるんだと思います。

これを知らないと、クラスメソッドが`extend`されていることに気づきにくいかもしれないです。また、`ActiveSupport::Concern`はいろんなところに頻出するので、知っておいた方がいいと思いました。

## ActiveSupport::Autoload

`ActiveSupport::Autoload#autoload`は`Module#autoload`の拡張で、`Module#autoload`は必要なファイルを必要なタイミングで`require`するメソッドです。

```
autoload(:Hoge, 'hoge') # 'hoge.rb'はこの時点ではrequireされていない
p Hoge # ここで'hoge.rb'がrequireされる
```

`ActiveSupport::Autoload#autoload`は、「`Hoge`はhoge.rbにあるはず」という「設定より規約」に従って、`Module#autoload`の第2引数を省略できるメソッドなので、上のコードは下のように書けます。

```
extend ActiveSupport::Autoload
autoload :Hoge
p Hoge # ここで'hoge.rb'がrequireされる
```

これもファイル名が省略されているということを知らないと、どのファイルを`require`しているか見えづらいと思います。

## 最後に

あまりまとまらなくてすごい量になってしまいました。簡単なgemを作るのに知っておくべきことがいろいろあって大変でした。間違っていることがあれば修正しますので、コメントいただけると助かります。また、params\_inquirerもまだ未完成なので、pull requestも待ってます。
