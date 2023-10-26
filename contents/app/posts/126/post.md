---
title: rablを使ってRailsのAPIレスポンスを簡潔に定義する
time: 2012-05-27 01:50
tags: ['rails']
---

コントローラでJSONレスポンスを定義する場合、

```
class EntriesController < ApplicationController
  respond_to :json

  def index
    @entries = Entry.all
    respond_with @entries.to_json(:only => :title, :body, :include => {
      :user => { :only => :name },
      :comment => { :only => :name },
      :image => { :only => :file }
    })
  end
end
```

などと、to\_jsonまたはas\_jsonで:onlyや:includeオプションを使ってフィールドを指定できます。ただ、これでは冗長だし、より複雑な構造のレスポンスを定義するとなると面倒です。そこで、簡潔に複雑な構造を定義するためにrablというgemを使います。

```
gem 'rabl'
```

rablはjsonやxmlなどのAPIレスポンスを記述するためのDSLです。rablを使ってJSONレスポンスを書き換えます。

```
# app/views/entries/index.json.rabl

collection @entries
attributes :title, :body

child(:user) do
  attributes :name
end

child(:comments) do
  attributes :name
end

child(:images) do
  node(:thumb) {|image| image.file.thumb.url }
  node(:main) {|image| image.file.main.url }
end
```

nodeを使うと、to\_jsonの:methodオプションと同じことができるので、構造の深い部分にある値を取得したいときに便利です。  
rablで定義することによってコントローラもスリムになります。

```
class EntriesController < ApplicationController
  def index
    @entries = Entry.all
  end
end
```

レスポンスはcurlで確認できます。

```
$ curl http://localhost:3000/entries.json
```

#### 参考

- [nesquena/rabl](https://github.com/nesquena/rabl)
- [#322 RABL - RailsCasts](http://railscasts.com/episodes/322-rabl?language=ja&view=asciicast)
