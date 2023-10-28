---
title: RailsのReloaderの仕組み
time: 2014-12-30 01:39
tags: ['rails']
---

Resqueのworker上で実行されるコードが古いまま更新されないというような問題があって、意味もわからず書いたコードでなんとかその場を収めたんだけど、気持ち悪いのでRailsでいかにしてコードが更新されるのか調べてみることにした。

# TL;DR

未定義の定数が参照されると、`ActiveSupport::ModuleConstMissing`によって拡張された`Module#const_missing`が呼ばれる。命名規則に基いて定数名からファイル名が推測され、`autoload_paths`に存在するファイルを見つける。そのファイルがロード済みであればそこで終了。ロード済みでなければ`Kernel.load`でロードし、ロードされた定数は配列で管理される。

development環境では、Railsのmiddleware stackに`ActionDispatch::Reloader`というmiddlewareがあり、リクエストごとにファイルの最終更新日時を確認し、変更されていれば`ActiveSupport::Dependencies.clear`を呼ぶ。これによって、ロード済みのファイルが空っぽになり、ロードされた定数もすべて削除される（＝未定義状態に戻る）。なので、ファイルが変更されるたびに`const_missing`から始まる一連のフローが起こり、`Kernel.load`によって最新のコードがロードされるようになっている。

以下は、上述の結論に至るまでのソースコードリーディングのメモです。分かりにくいかも。

# ActionDispatch::Reloader

ActionDispatch::ReloaderはRackミドルウェアなので、`#call`の中で初期化時に受け取った他のRackミドルウェアの`#call`を呼んでいる。その前後でリロードに関する処理を実行しているはずだ。

```
def call(env)
  @validated = @condition.call
  prepare!

  response = @app.call(env)
  response[2] = ::Rack::BodyProxy.new(response[2]) { cleanup! }

  response
rescue Exception
  cleanup!
  raise
end

def prepare!
  run_callbacks :prepare if validated?
end

def cleanup!
  run_callbacks :cleanup if validated?
ensure
  @validated = true
end
```

次のRackミドルウェアが処理を行う前後で`prepare!`と`cleanup!`を呼んでいる。その中身は`run_callbacks`を呼んでいる。これは`ActiveSupport::Callbacks`で定義されているメソッドで、`set_callbacks`で登録されたcallbackを実行する。なので、`:prepare`と`:cleanup`というイベントに対してどこかで登録されたcallbackがされている。このcallbackの登録を行うメソッドも`ActionDispatch::Reloader`に含まれている。

```
def self.to_prepare(*args, &block)
  # ...
  set_callbacks(:prepare, *args, &block)
end

def self.to_cleanup(*args, &block)
  # ...
  set_callbacks(:cleanup, *args, &block)
end
```

この2つのメソッドを使ってcallbackの登録が行われている。これらを呼び出している箇所を探すと、`Rails::Application::Finisher`で呼ばれていることがわかる。

# Rails::Application::Finisher

```
initializer :set_clear_dependencies_hook, group: :all do
  callback = lambda do
    ActiveSupport::DescendantsTracker.clear
    ActiveSupport::Dependencies.clear
  end

  if config.reload_classes_only_on_change
    reloader = config.file_watcher.new(*watchable_args, &callback)
    self.reloaders << reloader

    ActionDispatch::Reloader.to_prepare(prepend: true) do
      reloader.execute
    end
  else
    ActionDispatch::Reloader.to_cleanup(&callback)
  end
end
```

`initializer`は`Rails::Initializable`で定義されているメソッドでRailsの初期化時に実行される処理を登録することができる。つまり、Railsの初期化時に`:prepare`または`:cleanup`のcallbackを登録しているということになる。

`reload_classes_only_on_change`という設定はデフォルトで`true`になっていて、依存するファイルが変更されたときだけクラスを再読み込みするかどうかを制御する。`file_watcher`はデフォルトでは`ActiveSupport::FileUpdateChecker`を指している。つまり、デフォルトでは、`:prepare`のときに`ActiveSupport::FileUpdateChecker#execute`が実行されるように設定されていることになる。

`ActiveSupport::FileUpdateChecker`は初期化時に渡されたファイルを配列として受け取り、またそれらが更新されたときに実行されるブロックを受け取る。`#execute`はファイルが更新されているかどうかに関わらずブロックを実行する。ここで実行されるのは、以下のブロックとなる。

```
callback = lambda do
  ActiveSupport::DescendantsTracker.clear
  ActiveSupport::Dependencies.clear
end
```

ここまでをまとめると、リクエストを受けるごとに上の2つのメソッドが実行されコードのリロードが行われるということになる。

# ActiveSupport::DescendantsTracker

```
def clear
  if defined? ActiveSupport::Dependencies
    @@direct_descendants.each do |klass, descendants|
      if ActiveSupport::Dependencies.autoloaded?(klass)
        @@direct_descendants.delete(klass)
      else
        descendants.reject! { |v| ActiveSupport::Dependencies.autoloaded?(v) }
      end
    end
  else
    @@direct_descendants.clear
  end
end
```

`@@direct_descendants`の中身を消去しているようだ。これはHashであり、中身がキーがクラスで、値がそのクラスを継承したサブクラスの配列となっている。`Class#inherited`をoverrideしており、`ActiveSupport::DescendantsTracker`を`extend`しているクラスを継承したタイミングで`@@direct_descendants`に追加される。`ActiveSupport::DescendantsTracker`は例えば`ActiveRecord::Base`で`extend`されているため、`ActiveRecord::Base`のサブクラス、つまり通常のModelクラスは`ActiveRecord::Base.descendants`から取得できる。これを利用しているのが先述した`ActiveSupport::Callbacks`で、callbackをサブクラスから親クラスへ辿っていくときに利用されている。

# ActiveSupport::Dependencies

```
def clear
  log_call
  loaded.clear
  loading.clear
  remove_unloadable_constants!
end
```

`loaded`と`loading`はクラス変数`@@loaded`および`@@loading`へのアクセサで`mattr_accessor`によって定義されている。そして、これらのクラス変数の実体は`Set`オブジェクトだ。

次に`loaded`と`loading`にいつ何が追加されるのか調べると、`ActiveSupport::Dependencies.require_or_load`というメソッドで呼ばれている。

```
def require_or_load(file_name, const_path = nil)
  # ...
  file_name = $` if file_name =~ /\.rb\z/
  expanded = File.expanded_path(file_name)
  return if loaded.include?(expanded)

  loaded << expanded
  loading << expanded

  begin
    if load?
      # ...

      load_args = ["#{file_name}.rb"]
      load_args << const_path unless const_path.nil?

      if !warnings_on_first_load or history.include?(expanded)
        result = load_file(*load_args)
      else
        enable_warnings { result = load_file(*load_args) }
      end      
    else
      # ...
    end
  rescue Exception
    loaded.delete expanded
    raise
  ensure
    loading.pop
  end

  history << expanded
  result
end
```

`loaded`と`loading`に追加されているのはおそらくロードするファイルの絶対パスと思われる。そして、一連のロードが完了したら`loading`からは削除されるようだ。`loading`は読み込み中の再読み込みを防ぐために一時的に利用される変数らしい。一方、`loaded`は既にロード済みかどうかをチェックして、ロード済みであれば`require_or_load`を中断させるために使われているようだ。実際のロードの処理は`load_file`で行われるようだ。`ActiveSupport::Dependencies.clear`によって`loaded`が空になると、`require_or_load`内で再度`load_file`を実行することになる。

```
def load_file(path, const_paths = loadable_constants_for_path(path))
  # ...
  const_paths = [const_paths].compact unless const_paths.is_a? Array
  parent_paths = const_paths.collect { |const_path| const_path[/.*(?=::)/] || ::Object }

  result = nil
  newly_defined_paths = new_constants_in(*parent_paths) do
    result = Kernel.load path
  end

  autoloaded_constants.concat newly_defined_paths unless load_once_path?(path)
  autoloaded_constants.uniq!
  # ...
  result
end
```

`const_paths`は`app/models/user.rb`と`app/controllers/users_controller.rb`いうファイルがあれば`"User"`と`"UsersController"`という表す文字列を含む配列となる。`parent_paths`は`const_paths`の中で`"Admin::UsersController"`のようなネストするものと`"::Object"`を抽出した配列となる。`new_constants_in`は渡したブロックを実行し、その中で新たにロードされた定数を返す。なので、`Kernel.load`がとりあえず実行されるようだ。

話を少し戻して`require_or_load`はどこで呼ばれているかを調べると、`load_missing_constant`で呼ばれており、さらにこのメソッドは`ActiveSupport::ModuleConstMissing#const_missing`で呼ばれている。

```
module ModuleConstMissing
  # ...

  def const_missing(const_name)
    from_mod = anonymous ? guess_for_anonymous(const_name) : self
    Dependencies.load_missing_constant(from_mod, const_name)
  end
end
```

そしてこのmoduleは以下のようにして`Module`クラスに`include`されるため、デフォルトの`const_missing`の挙動をoverrideすることになる。

```
module ActiveSupport
  module Dependencies
    # ...

    def hook!
      Object.class_eval { include Loadable }
      Module.class_eval { include ModuleConstMissing }
      Exception.class_eval { include Blamable }
    end

    # ...
  end
end

ActiveSupport::Dependencies.hook!
```

つまり、定義されていない定数を参照する→`const_missing`→`load_missing_constant`→`require_or_load`→`load_file`という順番で呼ばれることになる。

ここで、`ActiveSupport::Dependencies.clear`の定義に戻る。

```
def clear
  log_call
  loaded.clear
  loading.clear
  remove_unloadable_constants!
end
```

見ていなかった`remove_unloadable_constants!`について見ていく。

```
def remove_unloadable_constants!
  autoloaded_constants.each { |const| remove_constant const }
  autoloaded_constants.clear
  Reference.clear!
  explicitly_unloadable_constants.each { |const| remove_constant const }
end
```

`autoloaded_constants`は上述の`load_file`でロードされた定数を含む配列だ。`remove_constant`はその名の通り定数を削除するメソッドで内部で`Module#remove_const`を呼んでいる。
