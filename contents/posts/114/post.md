---
title: Kobitoのスタイルを変更する
time: 2012-04-12 13:07
---

※Kobitoの中の人の許可をいただいております。

## 1. もともとのcssを退避しておく

```
$ cd /Application/Kobito.app/Contents/Resources
$ mv markdown.css markdown.css.orig
$ mv github.min.css github.min.css.orig
```

- プレビュー部分のスタイルは`github.min.css`と`markdown.css`にあるっぽいです。
- もとに戻せるように一旦退避しておきます。

## 2. 使いたいcssのシンボリックリンクをはる

```
$ ln -s ~/workspace/tmp/kobito.css markdown.css 
```

- 自分のcssへのシンボリックリンクを`markdown.css`として貼っておきます。
- Kobitoのアップデートに伴って自分のスタイルが消えるのを防ぐため、外に実際のスタイルを置いておきます。
- 自分が使っているスタイルを最後に載せておきました。

## 注意点

- アップデートを行うと、シンボリックリンクも消えるため、スタイルがもとに戻ります。
- 以上のような作業をもう一度行う必要があります。

## スクリーンショット

![screenshot](http://cache.gyazo.com/b818fec9dc127ef399d2b7d3715643c5.png)

## cssサンプル

- githubで使われているシンタックスハイライトを使ってみましたが効きませんでした。

```css:kobito.css
/*
Copyright (c) 2011, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 2.9.0
*/
html{color:#000;background:#FFF}body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,select,p,blockquote,th,td{margin:0;padding:0}table{border-collapse:collapse;border-spacing:0}fieldset,img{border:0}address,button,caption,cite,code,dfn,em,input,optgroup,option,select,strong,textarea,th,var{font:inherit}del,ins{text-decoration:none}li{list-style:none}caption,th{text-align:left}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}q:before,q:after{content:''}abbr,acronym{border:0;font-variant:normal}sup{vertical-align:baseline}sub{vertical-align:baseline}legend{color:#000}

/* ------------------------------
 * HTML element
 * ------------------------------ */

html {
  background-color: #FFFFFF;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;  padding: 20px;}

p, h1, h2, h3, ul, pre {
  line-height: 1.6;
  margin-bottom: 20px;
}

h1, h2, h3 {
  color: #404040;
  font-weight: bold;
}

h1 {
  border-bottom: 1px solid #AAAAAA;
  font-size: 24px;
}

h2 {
  font-size: 18px;
}

em {
  font-style: italic;
}

ul {
  margin-left: 30px;
}

li {
  list-style: disc;
  margin-bottom: 10px;
}

code, pre {
  background-color: #EEEEEE;
  border: 1px solid #AAAAAA;
  font-family: Courier, monospace;
}

code {
  margin: 0 5px;
  padding: 0 5px;
}

pre {
  line-height: 1.5;
  overflow: auto;
  padding: 10px;
}

pre code {
  border: none;
  margin: 0;
  padding: 0;
}

/* ------------------------------
 * syntax hightlight for Kobito
 * inspired by https://github.com/mojombo/tpw/blob/master/css/syntax.css
 * ------------------------------ */

.highlight  { background: #ffffff; }
.highlight .c { color: #999988; font-style: italic } /* Comment */
.highlight .err { color: #a61717; background-color: #e3d2d2 } /* Error */
.highlight .k { font-weight: bold } /* Keyword */
/* .highlight .o { font-weight: bold } */  /* Operator */
.highlight .cm { color: #999988; font-style: italic } /* Comment.Multiline */
.highlight .cp { color: #999999; font-weight: bold } /* Comment.Preproc */
.highlight .c1 { color: #999988; font-style: italic } /* Comment.Single */
.highlight .cs { color: #999999; font-weight: bold; font-style: italic } /* Comment.Special */
.highlight .gd { color: #000000; background-color: #ffdddd } /* Generic.Deleted */
.highlight .gd .x { color: #000000; background-color: #ffaaaa } /* Generic.Deleted.Specific */
.highlight .ge { font-style: italic } /* Generic.Emph */
.highlight .gr { color: #aa0000 } /* Generic.Error */
.highlight .gh { color: #999999 } /* Generic.Heading */
.highlight .gi { color: #000000; background-color: #ddffdd } /* Generic.Inserted */
.highlight .gi .x { color: #000000; background-color: #aaffaa } /* Generic.Inserted.Specific */
.highlight .go { color: #888888 } /* Generic.Output */
.highlight .gp { color: #555555 } /* Generic.Prompt */
.highlight .gs { font-weight: bold } /* Generic.Strong */
.highlight .gu { color: #aaaaaa } /* Generic.Subheading */
.highlight .gt { color: #aa0000 } /* Generic.Traceback */
.highlight .kc { font-weight: bold } /* Keyword.Constant */
.highlight .kd { font-weight: bold } /* Keyword.Declaration */
.highlight .kp { font-weight: bold } /* Keyword.Pseudo */
.highlight .kr { font-weight: bold } /* Keyword.Reserved */
.highlight .kt { color: #445588; font-weight: bold } /* Keyword.Type */
.highlight .m { color: #009999 } /* Literal.Number */
.highlight .s { color: #d14 } /* Literal.String */
.highlight .na { color: #008080 } /* Name.Attribute */
.highlight .nb { color: #0086B3 } /* Name.Builtin */
.highlight .nc { color: #445588; font-weight: bold } /* Name.Class */
.highlight .no { color: #008080 } /* Name.Constant */
.highlight .ni { color: #800080 } /* Name.Entity */
.highlight .ne { color: #990000; font-weight: bold } /* Name.Exception */
.highlight .nf { color: #990000; font-weight: bold } /* Name.Function */
.highlight .nn { color: #555555 } /* Name.Namespace */
.highlight .nt { color: #000080 } /* Name.Tag */
.highlight .nv { color: #008080 } /* Name.Variable */
.highlight .ow { font-weight: bold } /* Operator.Word */
.highlight .w { color: #bbbbbb } /* Text.Whitespace */
.highlight .mf { color: #009999 } /* Literal.Number.Float */
.highlight .mh { color: #009999 } /* Literal.Number.Hex */
.highlight .mi { color: #009999 } /* Literal.Number.Integer */
.highlight .mo { color: #009999 } /* Literal.Number.Oct */
.highlight .sb { color: #d14 } /* Literal.String.Backtick */
.highlight .sc { color: #d14 } /* Literal.String.Char */
.highlight .sd { color: #d14 } /* Literal.String.Doc */
.highlight .s2 { color: #d14 } /* Literal.String.Double */
.highlight .se { color: #d14 } /* Literal.String.Escape */
.highlight .sh { color: #d14 } /* Literal.String.Heredoc */
.highlight .si { color: #d14 } /* Literal.String.Interpol */
.highlight .sx { color: #d14 } /* Literal.String.Other */
.highlight .sr { color: #009926 } /* Literal.String.Regex */
.highlight .s1 { color: #d14 } /* Literal.String.Single */
.highlight .ss { color: #990073 } /* Literal.String.Symbol */
.highlight .bp { color: #999999 } /* Name.Builtin.Pseudo */
.highlight .vc { color: #008080 } /* Name.Variable.Class */
.highlight .vg { color: #008080 } /* Name.Variable.Global */
.highlight .vi { color: #008080 } /* Name.Variable.Instance */
.highlight .il { color: #009999 } /* Literal.Number.Integer.Long */
```
