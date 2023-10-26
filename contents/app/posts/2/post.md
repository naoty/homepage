---
title: 掲示板 ver.2
time: 2010-06-10 13:53
tags: ['php']
---

できること

- データの送信
- データの表示
- データの削除

```
<body>

include_once("./ini.php");
include_once("./sql_request.php");

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

//データの書き込み
if(($_POST["name"] != "") && ($_POST["msg"] != "")){
	$sql = "INSERT INTO mb (name,msg) VALUES ('";
	$sql .= mysql_escape_string($_POST["name"])."','";
	$sql .= mysql_escape_string(mb_substr($_POST["msg"],0,2048))."')";
	sql_request($sql);
}

//データの削除
if((int)($_POST["delete"])>0){
	$sql = "DELETE FROM mb WHERE id = ".(int)($_POST["delete"]);
	sql_request($sql);
}

//データと削除ボタンの表示
$arr = sql_request("SELECT * FROM mb ORDER BY actime DESC");
if($arr !== false){
	for($i=0;$i<count($arr);$i++){
		echo "\n";
		echo "\n";
		echo "".$arr[$i]["name"]."：\n";
		echo "".$arr[$i]["msg"]." \n";
		echo "".$arr[$i]["actime"]."\n";
		echo "".$arr[$i]["id"]."' />\n";
		echo "\n";
		echo "\n";
		echo "\n\n";
	}
}

?>

body>
```
