---
title: MongoDBを使う際のRspecの設定メモ
time: 2011-07-18 22:52
tags: ['rspec']
---

MongoDBのORMとしてMongoidを使う場合。

```
# /Gemfile
source 'http://rubygems.org'

gem 'rails', '3.0.9'
gem 'rake', '0.8.7'
gem 'mongoid'
gem 'bson_ext'
gem 'rspec-rails'
gem 'factory_girl_rails'
```

以下のようなエラーがおきた。

```
$ rake spec
Mon Jul 18 22:43:46 [initandlisten] connection accepted from 127.0.0.1:51455 #17
Mon Jul 18 22:43:46 [conn17] end connection 127.0.0.1:51455
Mon Jul 18 22:43:46 [initandlisten] connection accepted from 127.0.0.1:51456 #18
/spec/spec_helper.rb:26:in `block in <top (required)>': undefined method `use_transactional_fixtures=' for #<RSpec::Core::Configuration:0x0000010087a298> (NoMethodError)
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core.rb:79:in `configure'
	from /spec/spec_helper.rb:10:in `<top (required)>'
	from /spec/models/user_spec.rb:1:in `require'
	from /spec/models/user_spec.rb:1:in `<top (required)>'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/configuration.rb:419:in `load'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/configuration.rb:419:in `block in load_spec_files'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/configuration.rb:419:in `map'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/configuration.rb:419:in `load_spec_files'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/command_line.rb:18:in `run'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/runner.rb:80:in `run_in_process'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/runner.rb:69:in `run'
	from /vendor/bundle/ruby/1.9.1/gems/rspec-core-2.6.4/lib/rspec/core/runner.rb:11:in `block in autorun'
Mon Jul 18 22:43:48 [conn18] end connection 127.0.0.1:51456
rake aborted!
ruby -S bundle exec rspec ./spec/models/user_spec.rb failed

(See full trace by running task with --trace)
```

ActiveRecord以外のORMを使う場合は、以下の2行をコメントアウトするといいらしい。

```
# /spec/spec_helper.rb

RSpec.configure do |config|
  # == Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  config.mock_with :rspec

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  #config.fixture_path = "#{::Rails.root}/spec/fixtures" # コメントアウト

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  #config.use_transactional_fixtures = true # コメントアウト
end
```
