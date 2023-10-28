---
title: VSCodeで現在時刻をｽｯと出す
time: 2022-01-17 21:43
tags: ["vscode", "lifehack"]
---

VSCodeで作業メモをとりながら作業していると、作業した時間を記録しておくために現在時刻のタイムスタンプをｽｯと出したくなる。

`Preferences: Configure User Snippets`からmarkdownを選んで、以下のようにスニペットを登録しておくと便利。`$CURRENT_YEAR`みたいな変数が組み込みで備わっているようだ。

```json
{
  "timestamp": {
    "prefix": "#timestamp",
    "body": [
      "[$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE $CURRENT_HOUR:$CURRENT_MINUTE:$CURRENT_SECOND]"
    ],
    "description": "Insert timestamp"
  }
}
```

ただし、デフォルトだとmarkdownでは補完が効かないはずなので、以下の設定も追加する必要がある。

```json
{
  "[markdown]": {
    "editor.quickSuggestions": true
  }
}
```
