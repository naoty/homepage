---
title: Rails3のルーティングの初歩
time: 2011-05-12 13:36
tags: ['rails']
---

```
resources :users
```

　これで、基本的なアクション（index, show, new, create, edit, update, delete）のマッピングができる。

```
resources :users do
  get 'mail', :on => :member
end
```

　他にアクションを加えたい場合、ブロック内に「HTTP verb」「アクション名」「member（単数）かcollection（複数）か」を加えればおｋ。この場合のルーティングヘルパーは「mail\_user\_path(id)」となる。

- -

2011.5.13追記

```
resources :users do
  get 'mail', :on => :member #=> mail_user_path(id)
  get 'group', :on => :collection #=> group_users_path
end
```

member（単数）だったらヘルパーも単数、collection（複数）だったらヘルパーも複数だった。Railsの単数複数は徹底してるねー。
