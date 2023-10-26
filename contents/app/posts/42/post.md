---
title: select_datetimeからの日付検索
time: 2011-03-09 19:59
tags: ['rails']
---

　日付を入力するフォームを簡単に作成できるselect\_date/select\_datetimeというヘルパーを使って日付検索を実装しました。まだ不完全なところがありそうですが。一応、記録しておきます。

- 期間で検索するには、select\_datetimeを2回使います。なので、パラメータを区別するためにprefixオプションを使います。
- パラメータをそのまま検索条件に使うことはできないので、mktime\_from\_selectというプライベートメソッドを用意して、Timeオブジェクトに変換します。
- @fromと@toという変数を使ってパラメータを保持しておくことで、入力した日付を引き続き表示させます。select\_datetimeの第1引数で表示する日付を設定できます。

View

```
<%= select_datetime(@from || Time.now, {:prefix => "from"}) %> 〜 
<%= select_datetime(@to || Time.now, {:prefix => "to"}) %>
```

Controller

```
def index
  conditions = []
  conditions << ["created_at>=?", mktime_from_select(params[:from])] unless params[:from][:year].empty?
  conditions << ["created_at<=?", mktime_from_select(params[:from])] unless params[:from][:year].empty?
  @users = User.find(:all, :condition => flatten_conditions(conditions))
  @from = mktime_from_select(params[:from]) || Time.now
  @to = mktime_from_select(params[:to]) || Time.now
end

private

def mktime_from_select(params)
  return false if params.nil?
  year = 0; month = 0; day = 0; hour = 0; minute = 0
  params.each do |key, val|
    case key
    when "year"
      year = val
    when "month"
      month = val
    when "day"
      day = val
    when "hour"
      hour = val
    when "minute"
      minute = val
    end
  end
  return Time.mktime(year, month, day, hour, minute)
end
```

> ※flatten\_conditionsについて  
> [http://d.hatena.ne.jp/zenpou/20080131/1201773558](http://d.hatena.ne.jp/zenpou/20080131/1201773558)
