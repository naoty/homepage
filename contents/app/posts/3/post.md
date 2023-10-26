---
title: 掲示板 ver.1
time: 2010-06-10 15:46
tags: ['php']
---

できること

- データの送信
- データの表示

```
<body>

include_once("./ini.php");
include_once("./sql_request.php");

//DB作成
sql_request("CREATE DATABASE IF NOT EXISTS ".DB_NAME." ;");

//テーブル作成
$sql = "
CREATE TABLE IF NOT EXISTS mb (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	actime TIMESTAMP(11) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	name VARCHAR(255) NULL,
	msg VARCHAR(4095) NULL
)
";
sql_request($sql);

?>

<form action="./MessageBoard.php" method="post">
氏名：<br>
<input type="text" name="name" maxlength="255" /><br>
メッセージ：<br>
<input type="text" name="msg" maxlength="255" width="400" /><br>
<input type="submit" value="post" />
form>

//フォームから送信された情報をテーブルに挿入
if(($_POST["name"] != "") && ($_POST["msg"] != "")){
	$sql = "INSERT INTO mb (name,msg) VALUES ('";
	$sql .= mysql_escape_string($_POST["name"])."','";
	$sql .= mysql_escape_string($_POST["msg"])."')";
	sql_request($sql);
}

//テーブルの情報を時間順に並び替えて表示
$arr = sql_request("SELECT * FROM mb ORDER BY actime DESC");
if($arr !== false){
	for($i=0;$i<count($arr);$i++){
		echo "".$arr[$i]["name"]."：
			".$arr[$i]["msg"]." 
			".$arr[$i]["actime"]."\n";
	}
}

?>

body>
```
