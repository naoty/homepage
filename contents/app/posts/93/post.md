---
title: Rails3.1でTwitter認証しTwitter APIを呼び出す
time: 2011-12-03 21:52
tags: ['rails']
---

Gemfile

```
gem 'devise'
gem 'omniauth'
gem 'twitter'
```

config/initialisers/devise.rb

```
Devise.setup do |config|
  config.omniauth :twitter, 'CONSUMER KEY', 'CONSUMER SECRET'
end
```

config/initializers/twitter.rb

```
Twitter.configure do |config|
  config.consumer_token = Devise.omniauth_configs[:twitter].args.first
  config.consumer_secret = Devise.omniauth_configs[:twitter].args.last
end
```

app/models/user.rb

```
class User < ActiveRecord::Base

  devise :omniauthable
  attr_accessor :client

  def follower_ids
    set_client
    @client.follower_ids.ids
  end

  private

  def set_client
    @client = Twitter.new(oauth_token: token, oauth_token_secret: secret)
  end

end
```

- -

補足：コントローラーでAPIを呼び出して結果をmemcachedにキャッシュする

Gemfile

```
gem 'devise'
gem 'omniauth'
gem 'twitter'
gem 'dalli'
```

config/environments/production.rb

```
SampleApp::Application.configure do
  config.cache_store = :dalli_store
end
```

app/controllers/users\_controller.rb

```
class UsersController < ApplicationController

  def index
    follower_ids = Rails.cache.fetch("#{current_user.name}_follower_ids") { current_user.follower_ids }
    # ...
  end

end
```
