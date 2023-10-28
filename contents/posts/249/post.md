---
title: Faraday middlewareの作り方
time: 2015-01-03 23:02
tags: ['ruby']
---

Faraday middlewareの要件としては、Rack middleware同様に

* `#initialize(app)`で他のmiddlewareを引数にとる
* `#call(env)`でリクエストの前処理を実装する。

の2点だけを満たせばいい。ただし、レスポンスを処理する場合は`#on_complete`内のブロックで実装する必要がある。

```rb
def call(request_env)
  @app.call(request_env).on_complete do |response_env|
    # パースなどレスポンスの処理
  end
end
```

ここまではREADME.mdにも書いてあるのだけど、レスポンスの処理を効率的に実装するための方法が用意されている。それは`Faraday::Response::Middleware`だ。使い方は以下の通り。

```rb
require "faraday"

module Faraday
  class Response
    class JSON < Middleware
      def parse(body)
        body.to_json
      end
    end

    register_middleware json: JSON
  end
end
```

* `#initialize(app)`で`@app = app`のようなことをしているため、特に書く必要はない。特別になにか必要であればoverrideする。
* `#parse(body)`でレスポンスをパースの処理を書くと、上述した`#on_complete`のブロックの中でこのメソッドが呼ばれ、`env.body`を`#parse(body)`の結果によって更新する。
* パース以外にレスポンス時の処理を記述したい場合、`#on_complete`を実装する。このメソッドは上述の`#on_complete`のブロック内で呼ばれるのだけど、これを実装すると`#parse`が呼ばれないので注意。
* `Faraday::Response.register_middleware`でキーとミドルウェアを登録できる。このキーを使って以下のように`:json`とミドルウェアを指定できる。

```rb
connection = Faraday.new do |connection|
  connection.response :json
  connection.adapter Faraday.default_adapter
end
```

---

簡単なので`Faraday::Response::Middleware`のソースコードを見てみる。

```rb
module Faraday
  class Response
    class Middleware < Faraday::Middleware
      def call(env)
        @app.call(env).on_complete do |environment|
          on_complete(enrivonment)
        end
      end

      def on_complete(env)
        env.body = parse(env.body) if respond_to?(:parse) && env.parse_body?
      end
    end
  end
end
```

* `#on_complete`ブロック内で`Middleware#on_complete`が呼ばれていることがわかる。
* さらにその中で`#parse`が実装されていれば呼ぶようになっている。

```rb
module Faraday
  class Middleware
    extend MiddlwareRegistry

    # ...

    def initialize(app = nil)
      @app = app
    end
  end
end
```

* `#initialize`であとに続くmiddlewareを取り込んでいる。
* `Faraday::MiddlewareRegistry`というモジュールで`.register_middleware`が定義されており、このメソッドでFaraday middlewareを指定する際のキーを登録できる。
