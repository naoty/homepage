---
title: ボタンによって処理を切り替える
time: 2011-03-30 17:26
tags: ['rails']
---

submit\_tagの場合  
view

```
<% form_tag -%>
  <%= submit_tag("Search", :name => "search") %>
  <%= submit_tag("Delete", :name => "delete") %>
<% end -%>
```

controller

```
if params[:search]
  // ...
elsif params[:delete]
  // ...
end
```

image\_submit\_tagの場合  
view

```
<% form_tag -%>
  <%= image_submit_tag("search.png", :name => "search") %>
  <%= image_submit_tag("delete.png", :name => "delete") %>
<% end -%>
```

controller

```
if params['search.x']
  // ...
elsif params['delete.x']
  // ...
end
```
