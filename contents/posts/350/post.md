---
title: db:migrateした分だけdb:rollbackするrubygemを書いた
time: 2018-11-11T15:27:00+0900
tags: ["rails"]
---

[naoty/batch_rollback](https://github.com/naoty/batch_rollback)というrubygemを書いた。

![](screencast.gif '様子')

これは`db:migrate`でmigrateしたversionやステップ数を記録しておいて、`db:rollback`でまとめてrollbackできるようにする。

# モチベーション
このrubygemを書いた動機としては、ロールバックを安全に自動化したかった。Railsアプリケーションをロールバックするには`rails db:rollback`を行うことになるが、そのとき問題になるのは`STEP`をいくつにするかということがある。リリース時に`db:migrate`したmigrationファイルがいくつあったかはリリースごとに異なるため、ロールバックを自動化する上で問題になる。

そこで、`db:migrate`時にmigrateされたバージョン数を記録しておき、`db:rollback`の`STEP`に指定するrubygemを書いた。

# 仕組み
`db:migrate`の前後にRakeタスクを追加し、migrationされたバージョンやステップを記録している。あるRakeタスクの前後に実行させたいRakeタスクを追加するには`Rake::Task#enhance`を使う。`Railtie`で`#enhance`したい場合は`Railtie.rake_tasks`ブロック内で行う。

```ruby
module BatchRollback
  class Railtie < Rails::Railtie
    rake_tasks do
      namespace :batch_rollback do
        task :pre_migration do
        end

        task :post_migration do
        end
      end

      Rake::Task["db:migrate"].enhance(["batch_rollback:pre_migration"]) do
        Rake::Task["batch_rollback:post_migration"].invoke
      end
    end
  end
end
```

migrationされたバージョンやステップの記録はrubygem内に定義したちょっとしたmodelから行っている。

```ruby
module BatchRollback
  class MigrationStep < ActiveRecord::Base
  end
end
```

こうしたmodelのためのテーブルを作成するには、migrationを使うわけにはいかないので、`ActiveRecord::ConnectionAdapters::SchemaStatements#create_table`を利用する。このメソッドを使うとmigrationで使うDSLを使って簡単にテーブルを作成できる。

```ruby
module BatchRollback
  class MigrationStep < ActiveRecord::Base
    class << self
      def create_table
        connection.create_table(table_name) do |t|
          t.string :current_version
          t.string :target_version
          t.integer :step
        end
      end
    end
  end
end
```

こういったテクニックを組み合わせることで今回のrubygemを実装することができた。
