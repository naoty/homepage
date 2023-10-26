---
title: Rails3.1にjquery-uiを導入する
time: 2011-09-25 01:50
tags: ['rails', 'jquery']
---

js

- app/assets/javascripts/application.jsに一行追加するだけ

```
# app/assets/javascrypts/application.js

// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery-ui // ←追加
//= require jquery_ujs
//= require_tree .
```

css

- vendor/assets/stylesheets/vendor.cssを作成
- vendor/assets/stylesheets/jquery-uiを作成して、そのなかにダウンロードしてきたjquery-ui-1.8.16.custom.cssをおく

```
# app/assets/stylesheets/application.css

/*
 * This is a manifest file that'll automatically include all the stylesheets available in this directory
 * and any sub-directories. You're free to add application-wide styles to this file and they'll appear at
 * the top of the compiled file, but it's generally better to create a new file per style scope.
 *= require_self
 *= require vendor // ←追加
 *= require_tree . 
*/
```

```
# vendor/assets/stylesheets/vendor.css

/*
 *= require_tree ./jquery-ui
 */
```

image

- エラーメッセージを見ながらディレクトリを用意してあげる
- 今回は、vendor/assets/images/jquery-ui/imagesのなかにダウンロードしてきた画像をおく

> 参考  
> [Ruby on Rails 3.1 and jQuery UI images - Stack Overflow](http://stackoverflow.com/questions/6048490/rails-3-1-and-jquery-ui-images)

- -

2011.10.1  
追記  
datepickerなどの日本語化ファイルを使いたい場合

```
// app/assets/javascripts/application.js

// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui
//= require vendor // ←追加
//= require_tree .
```

```
// vendor/assets/javascripts/vendor.js

//= require_tree ./jquery-ui
```

で、あとは、vendor/assets/javascripts/jquery-ui/配下に日本語ファイルをおけばおｋ。
