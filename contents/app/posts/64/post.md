---
title: ある条件でhiddenなHTMLタグを出力するヘルパーメソッドつくりました
time: 2011-07-11 15:26
tags: ['rails']
---

```
# application_helper.rb
def tag_hidden_if(tag, conditions, attributes = {}, &block)
  attributes = attributes.merge({'style' => 'display:none;'}) if conditions
  content_tag tag, attributes, &block
end
```

```
# index.html.erb
<% @articles.each_with_index do |article, i| -%>
  <%= tag_hidden_if :li, (i % 2 == 0), {:class => 'naotyhoge'} do %>
    # ...
  <% end -%>
<% end -%>
```

- この例だと、偶数の列は非表示になるはずです。
