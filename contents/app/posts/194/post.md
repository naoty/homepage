---
title: Rails 4.0だとCSRFトークンでエラーになる
time: 2013-06-28 23:41
tags: ['rails']
---

ついにRails 4がリリースされたので軽く触ってみたら、3.xから変わったところを見つけたので共有。まだ日本語の情報は見当たらなかった。

APIを試しに作ってみようと思い`curl`でPOSTリクエストを送ろうとしたら以下のようなエラーが。

```
$ curl -X POST -d "name='hoge'" http://localhost:3000/bikes
Can't verify CSRF token authenticity
Completed 422 Unprocessable Entity in 1ms

ActionController::InvalidAuthenticityToken (ActionController::InvalidAuthenticityToken):
...
```

Rails 3.xのときはWarningは出たものの、エラーにはならなかったような…。

`application_controller.rb`を見てみると、以下のようなコメントがありました。

```rb:application_controller.rb
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end
```

どうやらAPIを作りたい場合は、`:exception`ではなく`:null_session`を使うといいようです。

気になってactionpackのソースコードを読んでみました。Rails 3.xのときにソースコードを読んだときの記事を最後に載せたので参考にしてみてください。

```rb:actionpack-4.0.0/lib/action_controller/metal/request_forgery_protection.rb
def protect_from_forgery(options = {})
  self.forgery_protection_strategy = protection_method_class(options[:with] || :null_session)
  self.request_forgery_protection_token ||= :authenticity_token
  prepend_before_action :verify_authenticity_token, options
end
```

3.xのときと比べると32行目の`forgery_protection_strategy`というのが新しく追加されたようです。`with`オプションで指定したクラスをセットしているようなので詳しく見てみます。

```rb:actionpack-4.0.0/lib/action_controller/metal/request_forgery_protection.rb
def protection_method_class(name)
  ActionController::RequestForgeryProtection::ProtectionMethods.const_get(name.to_s.classify)
rescue NameError
  raise ArgumentError, 'Invalid request forgery protection method, use :null_session, :exception, or :reset_session'
end
```

デフォルトのように`:exception`が指定されてる場合は`Exception`クラスが、今回のようにAPI用に使う`:null_session`が指定された場合は`NullSession`クラスがどこかに定義されているようです。

```rb:actionpack-4.0.0/lib/action_controller/metal/request_forgery_protection.rb
class Exception
  def initialize(controller)
    @controller = controller
  end

  def handle_unverified_request
    raise ActionController::InvalidAuthenticityToken
  end
end
```

あったあった。どこかのタイミングで`handle_unverified_request`が呼ばれて、冒頭のように例外が発生するわけですね。

```rb:actionpack-4.0.0/lib/action_controller/metal/request_forgery_protection.rb
class ResetSession
  def initialize(controller)
    @controller = controller
  end

  def handle_unverified_request
    @controller.reset_session
  end
end
```

さらに`ResetSession`というクラスも見つかりました。これは例外を発生させる代わりにセッションをリセットするみたいです。これはRails 3.xのときと同じ挙動だったと思います。

```rb:actionpack-4.0.0/lib/action_controller/metal/request_forgery_protection.rb
class NullSession
  # ...

  # This is the method that defines the application behavior when a request is found to be unverified.
  def handle_unverified_request
    request = @controller.request
    request.session = NullSessionHash.new(request.env)
    request.env['action_dispatch.request.flash_hash'] = nil
    request.env['rack.session.options'] = { skip: true }
    request.env['action_dispatch.cookies'] = NullCookieJar.build(request)
  end

  # ...
end
```

で、`NullSession`クラスを見てみると、`NullSessionHash`オブジェクトと`NullCookieJar`オブジェクトというのが出てきますが、こいつらはどうやら中身が空っぽのモックオブジェクトっぽいです。

---

### 参考

Rails 3.xのときに`protect_from_forgery`の中身を追いかけた記録です。

[CSRFトークンの検証プロセス](http://qiita.com/naoty_k/items/ce037ea79bb5893f2b89)

