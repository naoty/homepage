---
title: activeadmin読んだ
time: 2014-12-31 01:32
tags: ['rails']
---

[activeadmin/activeadmin](https://github.com/activeadmin/activeadmin)を初めて使うことになったので、どういう仕組みになっているのか調べてみた。

# TL;DR

- `rails g active_admin:install`を実行するとlib/generators/active\_admin/install\_generator.rbが実行され、`ActiveAdmin.routes(self)`がconfig/routes.rbに追加される。
- app/admin/以下にあるResource定義ファイル内で実行される`ActiveAdmin.register`では、`ActiveAdmin::Resource`インスタンスが生成され、動的にResourceごとのcontrollerが生成される。それらはすべて`ActiveAdmin::ResourceController`を継承している。
- config/routes.rbに追加された`ActiveAdmin.routes(self)`は内部でapp/admin/以下のファイルをロードし（このタイミングで上述の`ActiveAdmin.register`が実行される）、`ActiveAdmin::Resource`インスタンスから動的にroutingが定義される。

長いので、以下`ActiveAdmin::`を`AA::`と略記する。

# Generator

Active Adminをセットアップするにはまず`rails g active_admin:install`を実行する。

このとき、lib/generators/active\_admin/install\_generator.rbに定義された`Rails::Generators::Base`のサブクラスにあるpublicメソッドが上から順番に実行される。Railsはlib/generators/\*\*/\*\_generator.rbにマッチするファイルに定義された`Rails::Generators::Base`のサブクラスをRails Generatorとして実行することができる。

```
# lib/generators/active_admin/install_generator.rb

module ActiveAdmin
  module Generators
    class InstallGenerator < ActiveRecord::Generators::Base
      # ...

      def setup_routes
        if options[:user]
          inject_into_file "config/routes.rb", "\n ActiveAdmin.routes(self)", after: /devise_for .*, ActiveAdmin::Devise\.config/
        else
          route "ActiveAdmin.routes(self)"
        end
      end

      # ...
    end
  end
end
```

いくつかメソッドが定義されている中で`setup_routes`を見ると、config/routes.rbに`ActiveAdmin.route(self)`を追記しているようだ。`self`は`Rails.application.routes.draw do ... end`のブロック内での`self`なので`ActionDispatch::Routing::Mapper`インスタンスを表している。

# Register a resource

Generatorでファイルの追加と変更を行ったあとは、管理画面で管理するResourceを作成する。例えば、`rails g active_admin:resource Post`を実行すると以下のようなapp/admin/post.rbが生成される。

```
# app/admin/post.rb

ActiveAdmin.register Post do
end
```

このブロックの中にviewやcontrollerの設定を追加していくのだけど、まず`ActiveAdmin.register`の定義を調べる。

```
# lib/active_admin.rb

module ActiveAdmin
  class << self
    # ...

    def application
      @application ||= ::ActiveAdmin::Application.new
    end

    # ...

    delegate :register, to: :application

    # ...
  end
end
```

ActiveSupportが拡張したメソッド`delegate`によって、`ActiveAdmin.register`の処理は実際には`AA::Application#register`が行っている。

```
# lib/active_admin/application.rb

def register(resource, options = {}, &block)
  ns = options.fetch(:namespace){ default_namespace }
  namespace(ns).register resource, options, &block
end
```

`options[:namespace]`がなければ`default_namespace`つまり`:admin`が`ns`に入る。`#namespace`は`namespaces[ns]`があればそれを返し、なければ`AA::Namespace`インスタンスを初期化し`namespaces`に追加した上で返す。よって、`AA::Namespace#register`が処理が渡っている。

```
# lib/active_admin/namespace.rb

def register(resource_class, options = {}, &block)
  config = find_or_build_resource(resource_class, options)

  register_resource_controller(config)
  parse_registration_block(config, resource_class, &block) if block_given?
  reset_menu!

  ActiveAdmin::Event.dispatch ActiveAdmin::Resource::RegisterEvent, config

  config
end
```

`find_or_build_resource`は`AA::Resource`インスタンスを返す。`#register_resource_controller`は以下のように定義されており、`Resource`インスタンスから動的に`AA::ResourceController`を継承するResourceごとのcontrollerを定義している。

```
# lib/active_admin/namespace.rb

def register_resource_controller
  eval "class ::#{config.controller_name} < ActiveAdmin::ResourceController; end"
  config.controller.active_admin_config = config
end
```

`parse_registration_block`は上述の例のapp/admin/post.rbで`ActiveAdmin.register`に渡されていたブロックを評価する部分だと思う。ブロックの中身を独自のDSLとして評価してカスタマイズを行っていると思う。

# Routing

Generatorによってconfig/routes.rbに追加された`ActiveAdmin.routes`の定義を調べる。

```
# lib/active_admin.rb

module ActiveAdmin
  # ...

  def application
    @application ||= ::ActiveAdmin::Application.new
  end

  # ...

  delegate :routes, to: :application

  # ...
end
```

`delegate`はActiveSupportが拡張しているメソッドで、メソッドの呼び出しを`to`で指定したオブジェクトに委譲する。なので、`ActiveAdmin.routes`は実際には`AA::Application#routes`を指している。

```
# lib/active_admin/application.rb

def routes(rails_router)
  load!
  router.apply(rails_router)
end
```

`load!`はapp/admin/\*\*/\*.rbを`Kernel.load`する。このとき上述したapp/admin/post.rbのようなResource定義ファイルがロードされる。そして、`ActiveAdmin.register`が実行され各Resourceのcontrollerが定義される。

`router`は`Router`インスタンスなので、`Router#apply`を調べる。

```
# lib/active_admin/router.rb

def apply(router)
  define_root_routes router
  define_resource_routes router
end
```

まず`define_root_routes`は以下のように定義されている。

```
# lib/active_admin/router.rb

def define_root_routes(router)
  router.instance_exec @application.namespaces.values do |namespaces|
    namespaces.each do |namespace|
      if namespace.root?
        root namespace.root_to_options.merge(to: namespace.root_to)
      else
        namespace namespace.name do
          root namespace.root_to_options.merge(to: namespace.root_to)
        end  
      end
    end
  end
end
```

この`router`は`ActionDispatch::Routing::Mapper`であり、`@application.namespaces.values`は`AA::Namespace`インスタンスの配列だ。

`ActiveAdmin.register`に特にoptionを指定しない場合、`namespace.root?`は`true`となる。`namespace.root_to_options`と`namespace.root_to`がどこで定義されているのか不明。。。なんだけど、`AA::Application`内にこれらが定義されており、`root_to_options`は`{}`で`root_to`は`"dashboard#index"`となっている。どのようにして`AA::Namespace`にそれらが定義されるのか不明ではあるが、おそらくこれらの値が使われるのだと思う。よって、結局このメソッドは`root to: "dashboard#index"`としているだけだ。

```
# lib/active_admin/router.rb

def define_resource_routes(router)
  router.instance_exec @application.namespaces, self do |namespaces, aa_router|
    resources = namespaces.value.flat_map{ |n| n.resources.values }
    resources.each do |config|
      routes = aa_router.resource_routes(config)

      # ...

      instance_exec &routes
    end
  end
end
```

`config`は先述した`AA::Resource`インスタンスだ。`aa_router`は`AA::Router`インスタンスなので`AA::Router#resource_routes`を見る。

```
# lib/active_admin/router.rb

def resource_routes(config)
  Prox.new do
    build_route = proc{ |verbs, *args|
      [*verbs].each{ |verb| send verb, *args }
    }
    build_action = proc{ |action|
      build_route.call(action.http_verb, action.name)
    }
    case config
    when ::ActiveAdmin::Resource
      resources config.resource_name.route_key, only: config.defined_actions do
        member do
          config.member_actions.each &build_action
        end

        collection do
          config.collection_actions.each &build_action
          post :batch_action if config.batch_action_enabled?
        end
      end
    when ::ActiveAdmin::Page
      # ...
    else
      # ...
    end
  end
end
```

このメソッドで返されるProcオブジェクトは`ActionDispatch::Routing::Mapper`インスタンスのコンテキストで`instance_exec`されるため、要するにこのProcオブジェクト内の処理がそのままconfig/routes.rb内のroutingの設定となる。Resourceインスタンスの情報から動的にroutingを組み立てているようだ。

# 所感

軽く触ってみたけど、Resource定義ファイルに独自DSLでviewを書いていくのが非常にカスタマイズが大変だし覚えることが多そうだな、あまり筋がよくなさそうという印象を受けた。

で、調べてみた結果、Resource定義ファイルから動的にcontrollerとかroutingとかを定義していて、それらをカスタマイズするのに独自DSLを使うという構図になっていることが分かった。管理画面って、ビジネスサイドの要求によってどんどんカスタマイズが必要になるので、カスタマイズに独自のDSLを覚えなくてはいけないとか、場合によってはカスタマイズできないみたいな状況は大きな問題だと思う。だから、動的にいろいろ生成する方針は管理画面の実装には適していないのではないかと思った。なんでこれがこんなに支持されているのかよくわからない。
