---
title: RSpecでmoduleをテストする
time: 2014-01-28 13:18
tags: ['rspec']
---

モジュールをテストするとき、適当なクラスを作ってそこにincludeした状態をletで使い回したい。というのをこんな感じで書いています。何か他にいい方法があれば教えてください。

```rb
describe HogeModule do
  let(:klass) do
    klass = Class.new
    klass.send(:include, HogeModule)
    klass
  end

  # ...
end
```

`Class.new`を使うのはこれが初めてかもしれない。
