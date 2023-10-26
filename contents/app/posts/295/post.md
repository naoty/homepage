---
title: Rails APIモードのdiff
time: 2017-03-22 15:46
tags: ['rails']
---

既に似たような記事は存在するものの、 initializer や middleware の差分までは触れられていなかったので、捕捉するような記事です。

## 主な差分
* アセットパイプライン関連の設定やディレクトリがなくなった。
* Cookie 等 Web ブラウザでしか使われない設定やミドルウェアがなくなった。

---

```sh
$ rails new rails-sample
$ rails new rails-api-sample --api
```

* `--api` をつけると API モードで rails アプリケーションを作成する。

```sh
$ diff -qr rails-sample rails-api-sample
Files rails-sample/Gemfile and rails-api-sample/Gemfile differ
Files rails-sample/Gemfile.lock and rails-api-sample/Gemfile.lock differ
Only in rails-sample/app: assets
Files rails-sample/app/controllers/application_controller.rb and rails-api-sample/app/controllers/application_controller.rb differ
Only in rails-sample/app: helpers
Only in rails-sample/app/views/layouts: application.html.erb
Files rails-sample/config/application.rb and rails-api-sample/config/application.rb differ
Files rails-sample/config/environments/development.rb and rails-api-sample/config/environments/development.rb differ
Files rails-sample/config/environments/production.rb and rails-api-sample/config/environments/production.rb differ
Only in rails-sample/config/initializers: assets.rb
Only in rails-sample/config/initializers: cookies_serializer.rb
Only in rails-api-sample/config/initializers: cors.rb
Files rails-sample/config/initializers/new_framework_defaults.rb and rails-api-sample/config/initializers/new_framework_defaults.rb differ
Only in rails-sample/config/initializers: session_store.rb
Files rails-sample/config/secrets.yml and rails-api-sample/config/secrets.yml differ
Only in rails-sample/lib: assets
Only in rails-sample/public: 404.html
Only in rails-sample/public: 422.html
Only in rails-sample/public: 500.html
Only in rails-sample/public: apple-touch-icon-precomposed.png
Only in rails-sample/public: apple-touch-icon.png
Only in rails-sample/public: favicon.ico
Only in rails-sample/test: helpers
Only in rails-sample/tmp/cache: assets
Only in rails-sample/vendor: assets
```

* API モードの Rails アプリケーションには、アセット関連のファイルやディレクトリ、ヘルパー、レイアウトファイル、そして cookie 等の Web ブラウザに関連する設定ファイルがない。
* 逆に API モードには CORS に関する initializer が存在する。

```
$ diff {rails-sample,rails-api-sample}/Gemfile
15,27d14
< # Use SCSS for stylesheets
< gem 'sass-rails', '~> 5.0'
< # Use Uglifier as compressor for JavaScript assets
< gem 'uglifier', '>= 1.3.0'
< # Use CoffeeScript for .coffee assets and views
< gem 'coffee-rails', '~> 4.2'
< # See https://github.com/rails/execjs#readme for more supported runtimes
< # gem 'therubyracer', platforms: :ruby
<
< # Use jquery as the JavaScript library
< gem 'jquery-rails'
< # Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
< gem 'turbolinks', '~> 5'
29c16
< gem 'jbuilder', '~> 2.5'
---
> # gem 'jbuilder', '~> 2.5'
37a25,27
> # Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
> # gem 'rack-cors'
>
44,45d33
<   # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
<   gem 'web-console', '>= 3.3.0'
```

* API モードでは、rack-cors という CORS をケアする rubygems が含まれる。
* 逆に、API モードでは不要なアセットパイプラインに関わる rubygems は含まれない。
* API モードでは、jbuilder がコメントアウトされているのが興味深い。JSON 以外のフォーマットが採用される可能性を見越しているのかな。

```sh
$ diff {rails-sample,rails-api-sample}/app/controllers/application_controller.rb
1,2c1
< class ApplicationController < ActionController::Base
<   protect_from_forgery with: :exception
---
> class ApplicationController < ActionController::API
```

* API モードでは CSRF 対策は不要なので削除されている。
* `ActionController::Base` ではなく `ActionController::API` を継承するようになっている。

```sh
$ diff {rails-sample,rails-api-sample}/config/application.rb
3c3,13
< require 'rails/all'
---
> require "rails"
> # Pick the frameworks you want:
> require "active_model/railtie"
> require "active_job/railtie"
> require "active_record/railtie"
> require "action_controller/railtie"
> require "action_mailer/railtie"
> require "action_view/railtie"
> require "action_cable/engine"
> # require "sprockets/railtie"
> require "rails/test_unit/railtie"
9c19
< module RailsSample
---
> module RailsApiSample
13a24,28
>
>     # Only loads a smaller set of middleware suitable for API only apps.
>     # Middleware like session, flash, cookies can be added back manually.
>     # Skip views, helpers and assets when generating a new resource.
>     config.api_only = true
```

* API モードでは `require` する rubygems をひとつひとつ書いている。sprockets は API モードでは不要なのでコメントアウトされている。
* `require rails/all` の内容と大差はなさそうだが、不要なものをコメントアウトできるようにしてある。
* API モードでは、generate 時にアセットやヘルパーの generate をスキップするオプションが設定されている。

```sh
$ diff {rails-sample,rails-api-sample}/config/environments/development.rb
40,46d39
<   # Debug mode disables concatenation and preprocessing of assets.
<   # This option may cause significant delays in view rendering with a large
<   # number of complex assets.
<   config.assets.debug = true
<
<   # Suppress logger output for asset requests.
<   config.assets.quiet = true
$ diff {rails-sample,rails-api-sample}/config/environments/production.rb
21,28d20
<   # Compress JavaScripts and CSS.
<   config.assets.js_compressor = :uglifier
<   # config.assets.css_compressor = :sass
<
<   # Do not fallback to assets pipeline if a precompiled asset is missed.
<   config.assets.compile = false
<
<   # `config.assets.precompile` and `config.assets.version` have moved to config/initializers/assets.rb
57c49
<   # config.active_job.queue_name_prefix = "rails-sample_#{Rails.env}"
---
>   # config.active_job.queue_name_prefix = "rails-api-sample_#{Rails.env}"
```

* 環境設定ファイルはアセットパイプラインの設定の有無が異なっているだけだった。

```sh
$ diff {rails-sample,rails-api-sample}/config/initializers/new_framework_defaults.rb
7,12d6
< # Enable per-form CSRF tokens. Previous versions had false.
< Rails.application.config.action_controller.per_form_csrf_tokens = true
<
< # Enable origin-checking CSRF mitigation. Previous versions had false.
< Rails.application.config.action_controller.forgery_protection_origin_check = true
<
```

* API モードには CSRF 対策は不要ということで、設定が省かれている。

```sh
$ cd rails-sample
$ bin/rails initializers > initializers.txt
$ cd ../rails-api-sample
$ bin/rails initializers > initializers.txt
$ cd ..
$ diff {rails-sample,rails-api-sample}/initializers.txt
3,5d2
< set_load_path
< set_load_path
< set_load_path
8,12d4
< set_autoload_paths
< set_autoload_paths
< set_autoload_paths
< add_routing_paths
< add_routing_paths
15,18d6
< add_routing_paths
< add_locales
< add_locales
< add_locales
23,28d10
< add_view_paths
< add_view_paths
< add_view_paths
< load_environment_config
< load_environment_config
< load_environment_config
43a26,29
> global_id
> active_job.logger
> active_job.set_configs
> active_job.set_reloader_hook
67,70d52
< global_id
< active_job.logger
< active_job.set_configs
< active_job.set_reloader_hook
75,90d56
< set_default_precompile
< quiet_assets
< setup_sass
< setup_compression
< jbuilder
< web_console.initialize
< web_console.development_only
< web_console.insert_middleware
< web_console.mount_point
< web_console.template_paths
< web_console.whitelisted_ips
< web_console.whiny_requests
< i18n.load_path
< prepend_helpers_path
< prepend_helpers_path
< prepend_helpers_path
95,98d60
< load_config_initializers
< load_config_initializers
< load_config_initializers
< engines_blank_point
100,103d61
< engines_blank_point
< engines_blank_point
< engines_blank_point
< append_assets_path
109,114c67
< append_assets_path
< override js_template hook
< append_assets_path
< append_assets_path
< turbolinks
< append_assets_path
---
> engines_blank_point
```

* API モードだと余計な initializers の読み込みが少なくなっているようだ。
* なお、このコマンドは筆者によって追加されている。

```sh
$ cd rails-sample
$ bin/rails middleware > middleware.txt
$ cd ../rails-api-sample
$ bin/rails middleware > middleware.txt
$ cd ..
$ diff {rails-sample,rails-api-sample}/middleware.txt
6d5
< use Rack::MethodOverride
8d6
< use Sprockets::Rails::QuietAssets
11d8
< use WebConsole::Middleware
17,19d13
< use ActionDispatch::Cookies
< use ActionDispatch::Session::CookieStore
< use ActionDispatch::Flash
23c17
< run RailsSample::Application.routes
---
> run RailsApiSample::Application.routes
```

* `Rack::MethodOverride` とは `params[:_method]` によって HTTP メソッドを上書きするためのミドルウェアで、PUT や DELETE リクエストはこれによって実現している。しかし、これらは フォーム等の HTML が存在しない API モードでは不要なので削除してあると思われる。
* cookie 等の Web ブラウザに関連するミドルウェアが API モードには含まれない。
