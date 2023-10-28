---
title: nginx.conf for Jekyll
time: 2012-02-21 16:12
tags: ['nginx']
---

nginxについての投稿が少なめなので、投稿してみる。
拙者のブログはJekyllで構築してるのですが、htmlを返すだけなので、locationブロックとかめんどくさい設定はしなくても、こんな感じで動きます。

```nginx:nginx.conf
# ...

http {
    # ...
    include sites/*.conf;
}
```

```nginx:sites/blog.conf
server {
    server_name naoty.jp;
    listen 80;
    root /var/www/blog;
}
```
