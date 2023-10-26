---
title: Rails3のDate.currentのソースコードリーディング
time: 2011-08-01 23:08
tags: ['rails']
---

```
# config/application.rb
module Hoge
  class Application < Rails::Application
    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
  end
end
```

- プロジェクトが作成されたばかりの設定を見ると、デフォルトのタイムゾーンはTime.zoneを参照していることがわかる。
- Date.currentのソースコードからもそれが読み取れる。

```
# activesupport/lib/active_support/core_ext/date/calculations.rb
require 'date'
class Date
  class << self
    def current
      ::Time.zone ? ::Time.zone.today : ::Date.today
    end
  end
end
```

```
# lib/date.rb
class Date
  def self.today(sg=ITALY)
    t = Time.now
    jd = civil_to_jd(t.year, t.mon, t.mday, sg)
    new!(jd_to_ajd(jd, 0, 0), 0, sg)
  end
end
```

- TimeクラスはC言語で実装されてるっぽいので、よくわからない。けど、タイムゾーンはシステムのものを使っていると思われる。

```
ruby-1.9.2-p180 :001 > Date.current
 => Mon, 01 Aug 2011
ruby-1.9.2-p180 :002 > Time.zone
 => (GMT+00:00) UTC
ruby-1.9.2-p180 :003 > Time.zone.today
 => Mon, 01 Aug 2011
$ date
Mon Aug 1 23:05:00 JST 2011
```

- ん？でも、タイムゾーンはJSTになってる。ここまで低水準だともうわから〜ん。

```
# config/application.rb
module Hoge
  class Application < Rails::Application
    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
    config.time_zone = 'Tokyo'
  end
end
```

- 試しに設定を日本時に変更してみると…

```
ruby-1.9.2-p180 :001 > Time.zone
 => (GMT+09:00) Tokyo
```

- Time.zoneは変更された。
- Railsアプリケーションのタイムゾーンを調べる場合はTime.zoneで確認できるようだ。

- -

追記

```
$ date
2011年 8月2日 火曜日 00時04分59秒 JST

ruby-1.9.2-p180 :001 > Date.current
 => Mon, 01 Aug 2011
ruby-1.9.2-p180 :002 > Date.today
 => Mon, 02 Aug 2011
ruby-1.9.2-p180 :003 > Time.zone
 => (GMT+00:00) UTC
ruby-1.9.2-p180 :004 > Time.now
 => 2011-08-02 00:05:23 +0900
```

Date.currentとDate.todayでタイムゾーンが異なるのは、前者がTime.zoneを参照しているからで、後者がTime.nowを参照しているからなのだが、それらが違うのがまた謎だ…
