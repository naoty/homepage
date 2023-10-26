---
title: ブランチごとにDB切り替えるヤツ作った
time: 2015-01-19 00:32
tags: ['oss']
---

Gitのブランチ名をもとにActiveRecordが接続するDBを切り替えるRubygemを作った。

[naoty/brancher](https://github.com/naoty/brancher)

# 使い方

```
group :development do
  gem "brancher"
end
```

Gemfileに書いて`bundle install`するだけ。あとは自動的にブランチごとに別々のDBが使われるようになる。

config/database.ymlでdevelopment環境のDB名を`sample_app_dev`と指定していた場合、`master`ブランチなら`sample_app_dev_master`が使われるし、`some_feature`ブランチなら`sample_app_dev_some_feature`が使われる。

# 問題意識

複数のブランチを移りながら開発していると、migrationを実行したブランチとしてないブランチでDBのスキーマが不整合になってエラーをおこすことがよくある。そのたびに`rake db:migrate`だったり`rake db:reset`だったり`rake db:schema:load`したりするのが非常に面倒だった。そういった問題を解決するためにブランチごとにDBを分けられるツールを作った。

# どう実現しているか

やっていることはconfig/database.ymlをロードしたオブジェクトをいじっているだけ。これをいじるタイミングは2つある。Railsアプリケーションの初期化時と`db:load_config`タスクだ。

Railsアプリケーションを初期化する際、`ActiveRecord::Base`がロードされたあとに`establish_connection`が実行される。このメソッドはconfig/database.ymlに基いてDBとのコネクションを接続するものなので、これが実行される前にDB名をブランチ名に従っていじってあげる必要がある。実際に実行されているコードは以下の通りだ。

```
# lib/active_record/railtie.rb

initializer "active_record.initialize_database" do |app|
  ActiveSupport.on_load(:active_record) do
    self.configurations = Rails.application.config.database_configuration

    begin
      establish_connection
      # ...
    end
  end
end
```

`Rails.application.config.database_configuration`はconfig/database.ymlの中身をERBで展開してYAMLとしてロードしたHashオブジェクトだ。これが`self.configurations`にセットされて`establish_connection`が実行される（ここでの`self`は`ActiveRecord::Base`）。よって、この初期化処理が実行される前に`Rails.application.config.database_configuration`をいじればいい。

初期化処理の一連の流れに割り込むには`Rails::Initializable.initializer`メソッドのオプションを使う。そして、その中で`Rails.application.config.database_configuration`の中身を上書きする。

```
# lib/brancher/railtie.rb

initializer "brancher.rename_database", before: "active_record.initialize_database" do
  Rails::Application::Configuration.send(:prepend, DatabaseConfigurationRenaming)
end
```

次に、`db:load_config`タスク内でもconfig/database.ymlをいじる必要がある。なぜかというと、`rake db:create`などの一部のRakeタスクは上述の初期化処理が実行されないからだ。`environment`タスクに依存しているタスクであれば、`environment`タスク内で初期化処理が行われるため問題ない。一方、`db:load_config`タスクは（おそらく）すべてのDBに関連するRakeタスクが依存しているため、ここでDB名をいじってあげればいい。

```
# lib/brancher/railtie.rb

rake_tasks do
  namespace :db do
    task :load_config do
      DatabaseRenameService.rename!(ActiveRecord::Base.configurations)
    end
  end
end
```

Rakeタスクは通常のメソッドとは異なり、同名のタスクを定義しても上書きされることはない。先に定義された順に同名のタスクが実行される。

# 所感

上のような初期化処理の仕組みやRakeタスクの追加などは[以前のエントリ](http://naoty.hatenablog.com/entry/2015/01/10/215538)などでRailsの内部を読み理解を深めることによって実現することができた。ブラックボックスの中身が見えてくると、こういったRails自体に関わる便利ツールを簡単に作ることができてしまう。引き続きRailsのソースコードリーディングは続けていきたい。
