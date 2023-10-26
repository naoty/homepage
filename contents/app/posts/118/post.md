---
title: foremanでthinを起動しても何も表示されない件の解決策
time: 2012-05-04 12:16
tags: ['rails']
---

```ruby:Procfile
web: rails s thin -p $PORT -e $RACK_ENV
```

こんなProcfileでforemanを起動すると、下記のように`Ctrl-c`押すまで何も表示されない。実際には動いてるので問題はないっちゃないけど。

```
$ foreman start
12:06:59 web.1     | started with pid 1683
^CSIGINT received
12:07:23 system    | sending SIGTERM to all processes
12:07:23 system    | sending SIGTERM to pid 1683
12:07:23 web.1     | => Booting Thin
12:07:23 web.1     | => Rails 3.2.3 application starting in development on http://0.0.0.0:5000
12:07:23 web.1     | => Call with -d to detach
12:07:23 web.1     | => Ctrl-C to shutdown server
12:07:23 web.1     | >> Thin web server (v1.3.1 codename Triple Espresso)
12:07:23 web.1     | >> Maximum connections set to 1024
12:07:23 web.1     | >> Listening on 0.0.0.0:5000, CTRL+C to stop
12:07:23 web.1     | >> Stopping ...
12:07:23 web.1     | >> Stopping ...
12:07:23 web.1     | Exiting
12:07:23 web.1     | process terminated
```

ただ、気持ち悪いので修正する方法を探したところ、foremanの開発者がgithubのissuesで答えてたのでメモ。config.ruに追記すればいい。

```ruby:config.ru
# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
run OGiri::Application

# ここ追記
$stdout.sync = true
```

```
$ foreman start
12:06:43 web.1     | started with pid 1669
12:06:48 web.1     | => Booting Thin
12:06:48 web.1     | => Rails 3.2.3 application starting in development on http://0.0.0.0:5000
12:06:48 web.1     | => Call with -d to detach
12:06:48 web.1     | => Ctrl-C to shutdown server
12:06:48 web.1     | >> Thin web server (v1.3.1 codename Triple Espresso)
12:06:48 web.1     | >> Maximum connections set to 1024
12:06:48 web.1     | >> Listening on 0.0.0.0:5000, CTRL+C to stop
```

無事解決！
