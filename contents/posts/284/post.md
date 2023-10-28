---
title: GroupedなUITableViewで上端のmarginをとりたい
time: 2016-07-19 17:20
tags: ['ios']
---

```swift
override func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
    if section == 0 {
        return .min
    } else {
        return super.tableView(tableView, heightForHeaderInSection: section)
    }
}
```

* `return 0`だとうまくいかない。
* `0`より大きい値を返すことで変更できるため、`CGFloat.min`を指定することで上端のmarginを消し去れる。
