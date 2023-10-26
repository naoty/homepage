---
title: Rails3.0.xと3.1のrails newとrails generateの違い
time: 2011-09-03 21:56
tags: ['rails']
---

１．rails new

```
$ rails _3.0.10_ new sample-3.0.10
      create
      create README
      create Rakefile
      create config.ru
      create .gitignore
      create Gemfile
      create app
      create app/controllers/application_controller.rb
      create app/helpers/application_helper.rb
      create app/mailers
      create app/models
      create app/views/layouts/application.html.erb
      create config
      create config/routes.rb
      create config/application.rb
      create config/environment.rb
      create config/environments
      create config/environments/development.rb
      create config/environments/production.rb
      create config/environments/test.rb
      create config/initializers
      create config/initializers/backtrace_silencers.rb
      create config/initializers/inflections.rb
      create config/initializers/mime_types.rb
      create config/initializers/secret_token.rb
      create config/initializers/session_store.rb
      create config/locales
      create config/locales/en.yml
      create config/boot.rb
      create config/database.yml
      create db
      create db/seeds.rb
      create doc
      create doc/README_FOR_APP
      create lib
      create lib/tasks
      create lib/tasks/.gitkeep
      create log
      create log/server.log
      create log/production.log
      create log/development.log
      create log/test.log
      create public
      create public/404.html
      create public/422.html
      create public/500.html
      create public/favicon.ico
      create public/index.html
      create public/robots.txt
      create public/images
      create public/images/rails.png
      create public/stylesheets
      create public/stylesheets/.gitkeep
      create public/javascripts
      create public/javascripts/application.js
      create public/javascripts/controls.js
      create public/javascripts/dragdrop.js
      create public/javascripts/effects.js
      create public/javascripts/prototype.js
      create public/javascripts/rails.js
      create script
      create script/rails
      create test
      create test/fixtures
      create test/functional
      create test/integration
      create test/performance/browsing_test.rb
      create test/test_helper.rb
      create test/unit
      create tmp
      create tmp/sessions
      create tmp/sockets
      create tmp/cache
      create tmp/pids
      create vendor/plugins
      create vendor/plugins/.gitkeep
```

```
$ rails new sample-3.1.0
      create
      create README
      create Rakefile
      create config.ru
      create .gitignore
      create Gemfile
      create app
      create app/assets/images/rails.png
      create app/assets/javascripts/application.js
      create app/assets/stylesheets/application.css
      create app/controllers/application_controller.rb
      create app/helpers/application_helper.rb
      create app/mailers
      create app/models
      create app/views/layouts/application.html.erb
      create app/mailers/.gitkeep
      create app/models/.gitkeep
      create config
      create config/routes.rb
      create config/application.rb
      create config/environment.rb
      create config/environments
      create config/environments/development.rb
      create config/environments/production.rb
      create config/environments/test.rb
      create config/initializers
      create config/initializers/backtrace_silencers.rb
      create config/initializers/inflections.rb
      create config/initializers/mime_types.rb
      create config/initializers/secret_token.rb
      create config/initializers/session_store.rb
      create config/initializers/wrap_parameters.rb
      create config/locales
      create config/locales/en.yml
      create config/boot.rb
      create config/database.yml
      create db
      create db/seeds.rb
      create doc
      create doc/README_FOR_APP
      create lib
      create lib/tasks
      create lib/tasks/.gitkeep
      create lib/assets
      create lib/assets/.gitkeep
      create log
      create log/.gitkeep
      create public
      create public/404.html
      create public/422.html
      create public/500.html
      create public/favicon.ico
      create public/index.html
      create public/robots.txt
      create script
      create script/rails
      create test/fixtures
      create test/fixtures/.gitkeep
      create test/functional
      create test/functional/.gitkeep
      create test/integration
      create test/integration/.gitkeep
      create test/unit
      create test/unit/.gitkeep
      create test/performance/browsing_test.rb
      create test/test_helper.rb
      create tmp/cache
      create tmp/cache/assets
      create vendor/assets/stylesheets
      create vendor/assets/stylesheets/.gitkeep
      create vendor/plugins
      create vendor/plugins/.gitkeep
         run bundle install
Fetching source index for http://rubygems.org/
Installing rake (0.9.2)
Using multi_json (1.0.3)
Using activesupport (3.1.0)
Using bcrypt-ruby (3.0.0)
Using builder (3.0.0)
Using i18n (0.6.0)
Using activemodel (3.1.0)
Using erubis (2.7.0)
Using rack (1.3.2)
Using rack-cache (1.0.3)
Using rack-mount (0.8.3)
Using rack-test (0.6.1)
Using hike (1.2.1)
Using tilt (1.3.3)
Using sprockets (2.0.0)
Using actionpack (3.1.0)
Using mime-types (1.16)
Using polyglot (0.3.2)
Using treetop (1.4.10)
Using mail (2.3.0)
Using actionmailer (3.1.0)
Using arel (2.2.1)
Using tzinfo (0.3.29)
Using activerecord (3.1.0)
Using activeresource (3.1.0)
Installing ansi (1.3.0)
Using bundler (1.0.18)
Installing coffee-script-source (1.1.2)
Installing execjs (1.2.4)
Installing coffee-script (2.2.0)
Using rack-ssl (1.3.2)
Using rdoc (3.9.4)
Using thor (0.14.6)
Using railties (3.1.0)
Installing coffee-rails (3.1.0)
Installing jquery-rails (1.0.13)
Using rails (3.1.0)
Installing sass (3.1.7)
Installing sass-rails (3.1.0)
Installing sqlite3 (1.3.4) with native extensions
Installing turn (0.8.2)
Installing uglifier (1.0.2)
Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.
```

- 3.1.0ではrails newでbundle installが実行される。ただ、これではsystem gemsにインストールされてしまい困る。
- そこで、以下のように--skip-bundleをつけてbundle installをスキップするといいかもしれない。

```
$ rails new sample-3.1.0 --skip-bundle
```

２．rails g

```
$ cd sample-3.0.10
$ rails g scaffold user name:string email:string
      invoke active_record
      create db/migrate/20110903125449_create_users.rb
      create app/models/user.rb
      invoke test_unit
      create test/unit/user_test.rb
      create test/fixtures/users.yml
       route resources :users
      invoke scaffold_controller
      create app/controllers/users_controller.rb
      invoke erb
      create app/views/users
      create app/views/users/index.html.erb
      create app/views/users/edit.html.erb
      create app/views/users/show.html.erb
      create app/views/users/new.html.erb
      create app/views/users/_form.html.erb
      invoke test_unit
      create test/functional/users_controller_test.rb
      invoke helper
      create app/helpers/users_helper.rb
      invoke test_unit
      create test/unit/helpers/users_helper_test.rb
      invoke stylesheets
      create public/stylesheets/scaffold.css
```

```
$ cd sample-3.1.0
$ rails g scaffold user name:string email:string
      invoke active_record
      create db/migrate/20110903125248_create_users.rb
      create app/models/user.rb
      invoke test_unit
      create test/unit/user_test.rb
      create test/fixtures/users.yml
       route resources :users
      invoke scaffold_controller
      create app/controllers/users_controller.rb
      invoke erb
      create app/views/users
      create app/views/users/index.html.erb
      create app/views/users/edit.html.erb
      create app/views/users/show.html.erb
      create app/views/users/new.html.erb
      create app/views/users/_form.html.erb
      invoke test_unit
      create test/functional/users_controller_test.rb
      invoke helper
      create app/helpers/users_helper.rb
      invoke test_unit
      create test/unit/helpers/users_helper_test.rb
      invoke assets
      invoke coffee
      create app/assets/javascripts/users.js.coffee
      invoke scss
      create app/assets/stylesheets/users.css.scss
      invoke scss
      create app/assets/stylesheets/scaffolds.css.scss
```

- 3.1から導入されたassetによって、リソースごとにjsとcssが生成されるようだ。
