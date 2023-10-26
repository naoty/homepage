---
title: ある条件であるクラスを追加するヘルパーメソッドつくりました
time: 2011-07-11 17:17
tags: ['rails']
---

```
# application_helper.rb
def tag_add_class_if(tag, conditions, cl, attributes = {}, &block)
  if conditions
    if attributes.keys.include?(:class)
      attributes[:class] += " #{cl}"
    else
      attributes.merge(:class => cl)
    end
  end
  content_tag tag, attributes, &block
end
```

```
# index.html.erb
<%= tag_add_class_if :ul, (@user == current_user), 'current', {:class => 'users'} do %>
  # ...
<% end -%>
#=> ...
```
