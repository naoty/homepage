---
title: "`rails s`読んだ"
time: 2015-01-10 21:55
tags: ['rails']
---

`rails s`でRailsサーバーが起動するまでに何が起きているのかを紐解くことでRailsとは何なのかを理解していきたい。今回読んでいくソースコードのコミットは`2d9b9fb5b5f6015e66d3ad5cb96bc1ba117fd626`だ。

# TL;DR

- `bin/rails s`がユーザーによって実行される。
  - Gemfileで管理されるrubygemを`require`する。
  - `Rails::CommandsTasks#server`を実行する。
    - config/application.rbを`require`する。
      - Railsを構成する各rubygemのrailtieを`require`する。
        - 各rubygemのinitializerが登録される。
    - config.ruが実行される。
      - 登録されたinitializerが実行される。
      - RailsアプリケーションがRackアプリケーションとして起動する。

# コマンドの実行

まずbin/railsを見る。bin/railsは`rails new`を実行したときに生成されるのだが、このひな形はrailties/lib/rails/generators/rails/app/templates/bin/railsにある。

```
# bin/rails

#!/usr/bin/env ruby
APP_PATH = File.expand_path('../../config/application', __FILE__ )
require_relative '../config/boot'
require 'rails/commands'
```

config/boot.rbとrails/commands.rbを見る。

```
# config/boot.rb

ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__ )

require 'bundler/setup' # Set up gems listed in the Gemfile.
```

- config/boot.rbはGemfileにあるgemをrequireするようだ。

```
# railties/lib/rails/commands.rb

ARGV << '--help' if ARGV.empty?

aliases = {
  "g" => "generate",
  "d" => "destroy",
  "c" => "console",
  "s" => "server",
  "db" => "dbconsole",
  "r" => "runner"
}

command = ARGV.shift
command = aliases[command] || command

require 'rails/commands/commands_tasks'

Rails::CommandsTasks.new(ARGV).run_command!(command)
```

- `rails s`と実行すると`aliases`の中から`"server"`という文字列を取得して`rails server`を実行することになる。

rails/commands/commands\_tasksを見る。

```
# railsties/lib/rails/commands/commands_tasks.rb

module Rails
  class CommandsTasks
    # ...

    def initialize(argv)
      @argv = argv
    end

    def run_command!(command)
      command = parse_command(command)
      if COMMAND_WHITELIST.include?(command)
        send(command)
      else
        write_error_message(command)
      end
    end

    # ...
  end
end
```

- `#parse_command`は`--version`や`--help`をそれぞれ`"version"`と`"help"`というコマンドに変換するもの。それ以外はそのまま返す。
- `COMMAND_WHITELIST`に含まれていれば実行、そうでなければエラーを出力する。
- 今回は`"server"`が`command`に入るので`send("server")`が実行され、`#server`が実行されることになる。

```
# railsties/lib/rails/commands/commands_tasks.rb

module Rails
  class CommandsTasks
    # ...

    def server
      set_application_directory!
      require_command!("server")

      Rails::Server.new.tap do |server|
        require APP_PATH
        Dir.chdir(Rails.application.root)
        server.start
      end
    end

    # ...
  end
end
```

- `#set_application_directory!`はconfig.ruがないディレクトリからでも`rails s`を実行できるようにするためのものらしい。
- `APP_PATH`bin/railsの中で代入されたconfig/application.rbなので、`require "config/application"`を`server.start`の前に実行している。

# 設定の読み込み

```
# config/application.rb

require File.expand_path('../boot', __FILE__ )

require 'rails/all'

Bundler.require(*Rails.groups)

module SampleApp
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true
  end
end
```

- 前述の通り、config/boot.rbは`require "bundler/setup"`を実行しておりGemfile.lockに記載されたバージョンのrubygemを`require`している。

rails/all.rbを見る。

```
# railties/lib/rails/all.rb

require "rails"

%w(
  active_record
  action_controller
  action_view
  action_mailer
  active_job
  rails/test_unit
  sprockets
).each do |framework|
  begin
    require "#{framework}/railtie"
  rescue LoadError
  end
end
```

- Railsを構成する各rubygemのrailtieを`require`している。

rails.rbを見る。

```
# railsties/lib/rails.rb

module Rails
  # ...

  class << self
    # ...
  end
end
```

- ここには`Rails.application`, `Rails.configuration`, `Rails.env`などの重要なメソッドが定義されているため、登場次第また見ていくことにする。

rails/all.rbとrails.rbについて見たので、config/applicationに戻る。

```
# config/application.rb

# ...

Bundler.require(*Rails.groups)

module SampleApp
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true
  end
end
```

- `Rails.groups`は上述したrails.rbで定義されているのでさっそく見る。

```
# railties/lib/rails.rb

module Rails
  class << self
    # ...

    def env
      @_env ||= ActiveSupport::StringInquirer.new(ENV["RAILS_ENV"] || ENV["RACK_ENV"] || "development")
    end

    # ...

    def groups(*groups)
      hash = groups.extract_options!
      env = Rails.env
      groups.unshift(:default, env)
      groups.concat ENV["RAILS_GROUPS"].to_s.split(",")
      groups.concat hash.map { |k, v| k if v.map(&:to_s).include?(env) }
      groups.compact!
      groups.uniq!
      groups
    end

    # ...
  end
end
```

- `Rails.groups`は`Rails.env`の値に合わせてBundlerが読みこむべきgroupを返す。
- `Rails.env`は環境変数`"RAILS_ENV"`または`"RACK_ENV"`から実行環境を返す。

config/application.rbに戻る。

```
# config/application.rb

# ...

module SampleApp
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true
  end
end
```

- `SampleApp::Application`が`Rails::Application`を継承するとき、以下のような実装によって`Rails::Application.inherited`が呼ばれ、`Rails.app_class`が`SampleApp::Application`となる。

```
# railties/lib/rails/application.rb

module Rails
  class Application < Engine
    class << self
      def inherited(base)
        super
        Rails.app_class = base
        add_lib_to_load_path!(find_root(base.called_from))
      end
    end
  end
end
```

# サーバーの起動

サーバー起動前にどういった設定を読み込んでいるか見たので、サーバーの起動について詳細に見ていく。

```
# railsties/lib/rails/commands/commands_tasks.rb

module Rails
  class CommandsTasks
    # ...

    def server
      set_application_directory!
      require_command!("server")

      Rails::Server.new.tap do |server|
        require APP_PATH
        Dir.chdir(Rails.application.root)
        server.start
      end
    end

    # ...
  end
end
```

- `#require_command!("server")`で`require "rails/commands/server"`をしている。

`Rails::Server`はrails/commands/server.rbで定義されているので見る。

```
# railsties/lib/rails/commands/server

module Rails
  class Server < ::Rack::Server
    # ...

    def initialize(*)
      super
      set_environment
    end

    # ...

    def start
      print_boot_information
      trap(:INT) { exit }
      create_tmp_directories
      log_to_stdout if options[:log_stdout]

      super
    ensure
      puts 'Exiting' unless @options && options[:daemonize]
    end

    # ...
  end
end
```

- スーパークラスの`::Rack::Server`がサーバー起動において主な役割を果たしているようだ。
- これ以降はRackのソースコードを追うことになるが本題から反れるので、結論だけ言うとconfig.ruが実行されることになる。

config.ruを見る。

```
# config.ru

require ::File.expand_path('../config/environment', __FILE__ )
run Rails.application
```

- config/environment.rbを読み込んでいる。
- その後`Rails.application`をrackアプリケーションとして実行している。

とりあえずconfig/environment.rbを見る。

```
# config/environment.rb

require File.expand_path('../application', __FILE__ )
Rails.application.initialize!
```

- config/application.rbは既に読み込まれているはず。

`Rails.application.initialize!`について見ていくため、まずは`Rails.application`の定義を見る。

```
# railties/lib/rails.rb

module Rails
  class << self
    def application
      @application ||= (app_class.instance if app_class)
    end
  end
end
```

- `app_class`は、config/application.rbで`Rails::Application`のサブクラスが定義されたときにそのサブクラスが代入される。
- `SampleApp::Application.instance`が呼ばれているが、これのメソッドは`Rails::Application`に定義されていると思われる。

`Rails::Application`を見る。

```
# railties/lib/rails/application.rb

module Rails
  class Application < Engine
    class << self
      def instance
        super.run_load_hooks!
      end
    end

    def run_load_hooks!
      return self if @ran_load_hooks
      @ran_load_hooks = true
      ActiveSupport.run_load_hooks(:before_configuration, self)

      @initial_variable_values.each do |variable_name, value|
        if INITIAL_VARIABLES.include?(variable_name)
          instance_variable_set("@#{variable_name}", value)
        end
      end

      instance_eval(&@block) if @block
      self
    end
  end
end
```

- `SampleApp::Application.instance`内で`super.run_load_hooks!`が呼ばれている。この`super`はスーパークラスで定義された`.instance`を呼んでおり、スーパークラスをたどると`Rails::Railtie.instance`が呼ばれていることがわかる。これはそのまま`new`を呼んでインスタンスを返すだけだ。なので、`super.run_load_hooks!`というのは`SampleApp::Application#run_load_hooks!`を指す。
- `SampleApp::Application#run_load_hooks!`は`Rails::Application`で上のように定義されており自分自身を返す。中で`ActiveSupport.run_load_hooks(:before_configuration, self)`を呼んでおり、これによって`:before_configuration`をフックとして登録しておいた処理が実行される。
- 結局、`Rails.application`は`SampleApp::Application`インスタンスということになる。

## initializerの実行

config/environment.rbに戻る。

```
# config/environment.rb

require File.expand_path('../application', __FILE__ )
Rails.application.initialize!
```

- `Rails.application.initialize!`はつまり`SampleApp::Application#initialize!`ということ。

`Rails::Application`を見る。

```
# railties/lib/rails/application.rb

module Rails
  class Application
    def initialize!(group=:default) #:nodoc:
      raise "Application has been already initialized." if @initialized
      run_initializers(group, self)
      @initialized = true
      self
    end
  end
end
```

- `#run_initializers`は`Rails::Initializable`で以下のように定義されている。

```
# railties/lib/rails/initializable.rb

module Rails
  module Initializable
    def run_initializers(group=:default, *args)
      return if instance_variable_defined?(:@ran)
      initializers.tsort_each do |initializer|
        initializer.run(*args) if initializer.belongs_to?(group)
      end
      @ran = true
    end
  end
end
```

- `#initializers`は`Rails::Application`で以下のように定義されている。

```
# railties/lib/rails/application.rb

module Rails
  class Application
    def initializers
      Bootstrap.initializers_for(self) +
      railties_initializers(super) +
      Finisher.initializers_for(self)
    end
  end
end
```

- `Bootstrap.initializers_for`とか`Finisher.initializers_for`は`Rails::Initializable`モジュールで以下のように定義されている。

```
# railties/lib/rails/initializable.rb

def initializers_for(binding)
  Collection.new(initializers_chain.map { |i| i.bind(binding) })
end
```

- `Initializable::Collection`を初期化しているようだ。

```
# railties/lib/rails/initializable.rb

class Collection < Array
  include TSort

  alias :tsort_each_node :each
  def tsort_each_child(initializer, &block)
    select { |i| i.before == initializer.name || i.name == initializer.after }.each(&block)
  end

  def +(other)
    Collection.new(to_a + other.to_a)
  end
end
```

- `TSort`モジュールはRubyの標準モジュールで、依存関係を解決する順番に並び替える（＝トポロジカルソート）実装を提供する。`#tsort_each_node`と`#tsort_each_child`の2つを実装する必要がある。
- `#tsort_each_node`はすべての要素を走査するメソッド、`#tsort_each_child`は子要素を走査するメソッド。
- `Collection#tsort_each_child`では与えられた`initializer`の前後の`initlaizer`に対してブロックを実行する。

`Initializable.initializers_for`に戻る。

```
# railties/lib/rails/initializable.rb

def initializers_chain
  initializers = Collection.new
  ancestors.reverse_each do |klass|
    next unless klass.respond_to?(:initializers)
    initializers = initializers + klass.initializers
  end
  initializers
end

def initializers_for(binding)
  Collection.new(initializers_chain.map { |i| i.bind(binding) })
end
```

- 続いて`.initializers_chain`を見る。
- `.ancestors`はスーパークラスや`include`しているモジュールを直接の親から順に並べて配列で返す。
- `.ancestors.reverse_each`なので、最も遠いクラスまたはモジュールから順に`initializers`を取得して一つの`Collection`に連結させている。

`initializers_chain`の要素はおそらく`Initializer`インスタンスだと思われるので、`Initializer#bind`を見る。

```
# railties/lib/rails/Initializable.rb

class Initializer
  def bind(context)
    return self if @context
    Initializer.new(@name, context, @options, &block)
  end
end
```

- `Initializer#initialize`の第2引数は、`Initializer#run`で`instance_exec`のレシーバとして利用される。今回の場合、これは`Rails::Application`インスタンスとなる。

`Rails::Application#initializers`に戻る。

```
# railties/lib/rails/application.rb

module Rails
  class Application
    def initializers
      Bootstrap.initializers_for(self) +
      railties_initializers(super) +
      Finisher.initializers_for(self)
    end
  end
end
```

`#railties_initializers`がまだ残っているので見る。

```
# railties/lib/rails/application.rb

module Rails
  class Application
    def ordered_railties
      @ordered_railties ||= begin
        order = config.railties_order.map do |railtie|
          # ...
        end

        all = (railties - order)
        all.push(self) unless (all + order).include?(self)
        order.push(:all) unless order.include?(:all)

        index = order.index(:all)
        order[index] = all
        order
      end
    end

    def railties_initializers(current)
      initializers = []
      ordered_railties.reverse.flatten.each do |r|
        if r == self
          initializers += current
        else
          initializers += r.initializers
        end
      end
      initializers
    end
  end
end
```

- `config.railties_order`はデフォルトでは`[:all]`を返すようになっているが、ここを変更することで実行するRailtieの`initializer`の順番を変更することもできるようだ。
- `#ordered_railties`が返すのは`all = (railties - order)`の部分なので、あとで詳しく`#railties`について見る。
- ある順番でソートされた各Railtieの`initializers`を結合して返している。

`#railties`は`Rails::Engine`から継承されたメソッドなので見る。

```
# railties/lib/rails/engine.rb

def railties
  @railties ||= Railties.new
end
```

`Rails::Engine::Railties`を見る。

```
# railties/lib/rails/engine/railties.rb

def initialize
  @_all ||= ::Rails::Railtie.subclasses.map(&:instance) +
    ::Rails::Engine.subclasses.map(&:instance)
end
```

- `::Rails::Railtie`または`Rails::Engine`のサブクラスをすべて返している（！）

`railties_initializers`に戻る。

```
# railties/lib/rails/application.rb

def railties_initializers(current)
  initializers = []
  ordered_railties.reverse.flatten.each do |r|
    if r == self
      initializers += current
    else
      initializers += r.initializers
    end
  end
  initializers
end
```

- `ordered_railties`は`::Rails::Railtie`または`::Rails::Engine`のサブクラスすべてだということがわかった。
- よって、それらの`initializers`をすべて連結したものを返していることになる。

`Rails::Application#initializers`について見たので、`#run_initializers`に戻る。

```
# railties/lib/rails/initializable.rb

def run_initializers(group=:default, *args)
  return if instance_variable_defined?(:@ran)
  initializers.tsort_each do |initializer|
    initializer.run(*args) if initializer.belongs_to?(group)
  end
  @ran = true
end
```

- `initializers`は`Initializable::Collection`インスタンスなので、`#tsort_each`によって依存関係を解決する順番で`#each`を行う。

`Initializer#run`を見る。

```
# railties/lib/rails/initializable.rb

class Initializer
  def run(*args)
    @context.instance_exec(*args, &block)
  end
end
```

- `@context`は`#bind`によってセットされる。
- `block`は`Initializer`が初期化される際に渡されたブロックだ。この`block`は`#bind`によってセットされた`@context`をレシーバとして実行される。
- 今回の場合、`@context`は`Rails::Application`インスタンスをレシーバとして`block`が実行されることになる。

続いて、実行される`Initializer`がどのように初期化されて登録されているのか見ていく。これは`Rails::Initializable::ClassMethods.initializer`によって行われる。

```
# railties/lib/rails/initializable.rb

def initializer(name, opts = {}, &blk)
  raise ArgumentError, "A block must be passed when defining an initializer" unless blk
  opts[:after] ||= initializers.last.name unless initializers.empty? || initializers.find { |i| i.name == opts[:before] }
  initializers << Initializer.new(name, nil, opts, &blk)
end
```

- `opts[:after]`は`Initializer`インスタンス間の依存関係の解決に利用される。`initializer`で特に指定しなければ既存の`initializers`の最後の要素が`initializer#after`になる。

## Railsアプリケーションの起動

`initializers`の実行について一通り眺めたのでこれでconfig/environment.rbを読んだことになる。config.ruに戻る。

```
# config.ru

require ::File.expand_path('../config/environment', __FILE__ )
run Rails.application
```

- ようやく`run Rails.application`でアプリケーションを起動できる。
- `Rails.application`が`SampleApp::Application`インスタンスであることは上述の通り。

# 参考

- [Ruby on Rails Hacking Guide // Speaker Deck](https://speakerdeck.com/a_matsuda/ruby-on-rails-hacking-guide)
