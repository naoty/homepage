---
title: mrubyで定義したクラスとメソッドをCから呼び出す
time: 2013-05-03 23:13
tags: ['c', 'mruby']
---

mrubyで書いた方がいいところはmrubyで書いてそうじゃないところはCで書く、という開発をするには、Cで定義した関数をRubyから実行させたり、逆にRubyで定義したクラスやメソッドをCから呼び出せるようにする必要があると思った。前者のような実装はmrbgemsを読めばたくさんある一方で、後者の実装は調べたけどあんまりなかった。そこで、先日「Head First C」でCの初歩を学んだことだし、mrubyのソースコードを読みながら後者の「mrubyで定義したクラスとメソッドをCから呼び出す」実装を試行錯誤してみた。

試行錯誤してみてとりあえず動いたというだけで、正しいやり方じゃないかもしれないので、コメントか[@naoty\_k](https://twitter.com/naoty_k)宛にメッセージをいただけるとありがたいです。また、参照しているmrubyのコミット番号は「9663a7」です。

## Rubyのクラスとメソッドを用意

適当にPersonクラスとメソッド2つを用意する。あとでこれらをCから呼び出す。

```
// person.rb

class Person
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name
    @age = age
  end

  def greeting
    "Hello, my name is #{name}, #{age} years old."
  end
end
```

## mrbcでコンパイル

RubyのファイルをCからロードするにはいくつか方法があるようだけど、今回はmrbcで\*.mrb形式にコンパイルしてCからロードするようにする。

```
$ ls
person.rb
$ mrbc person.rb
$ ls
person.mrb person.rb
```

## Cから定義したクラスとメソッドを呼び出す

CからRubyで定義した`Person`インスタンスを生成して`greeting`メソッドの結果を標準出力に表示してみる。

```
// greeting.c

#include <stdio.h>
#include <mruby.h>
#include <mruby/string.h>

int main()
{
    mrb_state* mrb = mrb_open();

    // mrubyファイルをロードする
    FILE *fd = fopen("person.mrb", "r");
    mrb_load_irep_file(mrb, fd);

    // クラスオブジェクトを取得する
    struct RClass *person = mrb_class_obj_get(mrb, "Person");

    // 引数をmrb_valueに変換する
    mrb_value person_value = mrb_obj_value(person);
    mrb_value name_value = mrb_str_new(mrb, "naoty", 5);
    mrb_value age_value = mrb_fixnum_value(25);

    // Person#newを呼び出す
    mrb_value naoty = mrb_funcall(mrb, person_value, "new", 2, name_value, age_value);

    // Person#greetingを呼び出す
    mrb_value greeting_value = mrb_funcall(mrb, naoty, "greeting", 0);

    // 返り値をchar*に変換して出力する
    char *greeting = mrb_string_value_ptr(mrb, greeting_value);
    printf("%s\n", greeting);

    mrb_close(mrb);
    return 0;
}
```

- \*.mrb形式のファイルをロードするには`mrb_load_irep_file()`を実行する。
- 次にクラスを取得するには`mrb_class_obj_get()`を実行し、メソッドを呼び出すには`mrb_funcall()`を実行する。
- `mrb_funcall()`には、第2引数にメソッドのレシーバ、第3引数にメソッド名、第4引数にメソッドの引数の数、第5引数以降にはメソッドの引数を渡す。第2引数と第5引数以降は`int`や`char*`などをそのまま渡すことはできなくて、`mrb_value`という構造体に変換する必要がある。変換するための関数については長くなりそうなので、別の記事にしようと思う。
- `mrb_funcall()`の返り値も`mrb_value`構造体なので、標準出力をするために`char*`に変換する。

## Cをコンパイルして実行

Cのソースコードをmrubyのヘッダーファイルやスタティックライブラリと一緒にコンパイルする。僕の環境だと以下のコマンドでコンパイルできた。

```
$ gcc -I ~/mruby/include greeting.c ~/mruby/build/host/lib/libmruby.a -lm -o greeting
$ ./greeting
Hello, my name is naoty, 25 years old.
```

greeting.cはperson.mrbに依存し、person.mrbはperson.rbに依存しているので、一連のビルドはMakefileかRakefileで自動化したほうがいいと思う。

```
// Rakefile

require "rake/clean"

CC = "gcc"
MRBC = "mrbc"

CLEAN.include("person.mrb")
CLOBBER.include("greeting")

task default: "greeting"

file "greeting" => ["greeting.c", "person.mrb"] do |t|
  sh "#{CC} -I ~/mruby/include #{t.prerequisites[0]} ~/mruby/build/host/lib/libmruby.a -lm -o #{t.name}"
end

file "person.mrb" => ["person.rb"] do |t|
  sh "#{MRBC} #{t.prerequisites[0]}"
end
```

```
$ rake
$ ./greeting
```

* * *

### 参考

- [組み込みC言語プログラマのためのmruby入門（後編）](http://www.kumikomi.net/archives/2012/12/ep17mrb3.php)

> @[naoty\_k](https://twitter.com/naoty_k) クラスの取り出しはmrb\_class\_obj\_get()、メソッドの呼び出しはmrb\_funcall()を使ってください。funcallには派生形あり。
> 
> — Yukihiro Matsumotoさん (@yukihiro\_matz) [2013年4月30日](https://twitter.com/yukihiro_matz/status/329229906561077248)

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
