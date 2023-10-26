---
title: CSRFトークンの検証プロセス
time: 2012-04-12 11:33
tags: ['rails']
---

# actionpack-3.2.2/lib/action_controller/metal/request_forgery_protection.rb

## line:67

	def protect_from_forgery(options = {})
  	  self.request_forgery_protection_token ||= :authenticity_token
  	  prepend_before_filter :verify_authenticity_token, options
	end

- `protect_from_forgery`はデフォルトで`ApplicationController`で宣言されている。
- `verify_authenticity_token`をすべてのアクションの前に実行するようになる。

## line:72

	def verify_authenticity_token
	  unless verified_request?
        logger.warn "WARNING: Can't verify CSRF token authenticity" if logger
        handle_unverified_request
  	  end
  	end

## line:84

	def handle_unverified_request
	  reset_session
	end

- `verified_request?`が`false`の場合はセッションがリセットされる。

## line:93

	def verified_request?
	  !protect_against_forgery? || request.get? ||
	    form_authenticity_token == params[request_forgery_protection_token] ||
	    form_authenticity_token == request.headers['X-CSRF-Token']
	end

- `params[request_forgery_protection_token]`は`protect_from_forgery`の中で定義されている通り`params[:authenticity_token]`になる。
- `params[:authenticity_token]`はformヘルパーが自動生成するhiddenフィールドから送信される。
- `params[:authenticity_token]`がない場合でも、HTTPヘッダーの`X-CSRF-Token`を設定すればいい。

## line:100

	def form_authenticity_token
	  session[:_csrf_token] ||= SecureRandom.base64(32)
	end

- `params[:authenticity_token]`または`request.headers['X-CSRF-Token']`が`session[:_csrf_token]`と一致しているかどうかが、CSRFトークンの検証の本体である。
