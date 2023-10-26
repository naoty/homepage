---
title: production環境のみダイジェスト認証を有効にする
time: 2011-10-31 20:41
tags: ['rails']
---

```
class ApplicationController < ActionController::Base
  USERS = { 'naoty' => 'coolguy' }

  protect_from_forgery
  before_filter { digest_authentication if Rails.env.production? }

  private

  def digest_authentication
    authenticate_or_request_with_http_digest do |name|
      USERS[name]
    end
  end
end
```

ポイントは3つ。

- Rails.env.production?でproduction環境かどうかを判定できる。同様にRails.env.development?なんかもできる。
- before\_filterにブロックを渡すことで、条件付きでフィルタを適用できる。
- authenticate\_or\_request\_with\_http\_digestでBasic認証（authenticate\_or\_request\_with\_http\_basicメソッド）より安全な認証を実装でき、かつ複数のパスを簡単に扱えるようになる。
