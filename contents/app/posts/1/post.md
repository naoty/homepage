---
title: sql_request ver.1
time: 2010-06-09 22:07
tags: ['php']
---

　PHP、MySQLの基礎的な知識が身についてきたので、そろそろ掲示板の作成に入ろうと思います。その前に、SQL文を実行するときに便利なユーザー定義関数を作っておきます。MySQLへのログイン、DBの選択、SQL文の実行、MySQLからのログアウト、SELECTの場合には値を返す、これらを簡単に呼び出せるようにしておきます。

```
function sql_request($sql){
  $return = array();
  $db_link = mysql_link(DB_HOST,DB_USER,DB_PASS);
  mysql_select_db(DB_NAME);
  $result = mysql_query($sql);
  if($result !== true){
    for(;$row = mysql_fetch_array($result);){
      $return[] = $row;
    }
  }
  mysql_close($db_link);
  return ($return == array()) ? false : $return;
}
```

　DB\_HOST、DB\_USER、DB\_PASS、DB\_NAMEは重要な情報なので、別のファイルに保存しておきinclude\_once関数で呼び出せるようにしておきます。で、あとは、$sqlにSQL文を代入すれば、それがPHPで実行されるわけですね。
