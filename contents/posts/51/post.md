---
title: CSV出力の機能テスト
time: 2011-04-28 17:41
tags: ['rails']
---

環境

- Ruby 1.9.1
- Rails 2.3.12
- テストコードというものを昨日しった拙者

例として、任意の年のアクセス数をcsv形式で出力するexportというアクションを機能テストしたい。そこで、選択可能な過去5年間についてリクエストをだして出力をテストする。

```
require 'test_helper'

class AccessCountsControllerTest < ActionController::TestCase
  test 'export' do
    ((Date.today.year - 5)..(Date.today.year)).each do |year|
      post(:export, {:year => "#{year}"})
      assert_response :success
      assert_not_nil @response.body
    end
  end
end
```

@response.bodyに出力された内容が入っているらしい。どうやら、JSON.parseやcsvのパーサを使うことで@response.bodyの中身を解析し、中身を詳細にテストすることもできるようだ。
