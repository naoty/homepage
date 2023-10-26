---
title: 容赦無いCollection Insert
time: 2012-02-21 15:59
tags: ['rails']
---

Mongodbに大量のデータをぶち込もうとすると、「Exceded maximum insert size of 16,000,000 bytes」などとエラーを吐くので、入るまで半分にしてねじ込み続ける容赦無いスクリプトを書いた。

```ruby
def yousyanai_insert(data)
  begin
    NaotyModel.collection.insert(data)
  rescue
    data.each_slice(data.length / 2) {|half_data| yousyanai_insert(half_data) }
  end
end
```
