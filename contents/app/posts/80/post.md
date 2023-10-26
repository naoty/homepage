---
title: Twitter APIのエラーの回避方法
time: 2011-09-09 03:26
---

```
// http://api.twitter.com/statuses/friends.json
{
    error: "This method requires authentication."
    request: "/statuses/friends.json"
}

// http://api.twitter.com/statuses/friends.json?screen_name=naoty_k
{
  - errors: [
      - {
          code: 37
          message: "Not authorized to use this endpoint"
        }
  ]
}

// http://api.twitter.com/1/statuses/friends.json?screen_name=naoty_k
[
  - {
      show_all_inline_media: false
      contributors_enabled: false
      geo_enabled: false
      profile_background_tile: false
      protected: false
    },
  - {

    } 
]
```

認証済みなのに「This method requires authentication.」「Not authorized to use this endpoint」みたいなエラーがおきたら、パラメータにscreen\_nameを渡して、1を追加してあげるとうまくいった。なにこれ？
