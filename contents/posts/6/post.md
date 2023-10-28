---
title: 掲示板 ver.2.1
time: 2010-06-20 17:43
tags: ['php']
---

　掲示板 Lv.1.2を改良し、テーブル表示にして削除機能を加えました。

```
table,tr,td {
	border: 1px solid;
	border-collapse: collapse;
}
```

```
<body>

/ *****DB情報の読み込み***** /
include_once("ini.php");

/ *****DBへ接続、DBの選択***** /
$con = mysql_connect(DB_HOST,DB_USER,DB_PASS);
mysql_select_db(DB_NAME);

/ *****フォーム表示***** /
echo '';
echo '氏名：';
echo '';
echo 'メッセージ：';
echo '';
echo '';
echo '';

/ *****utf-8にエンコーディング***** /
$user_d = mb_convert_encoding($_POST["user"],"utf-8","utf-8,euc-jp,sjis");
$msg_d = mb_convert_encoding($_POST["msg"],"utf-8","utf-8,euc-jp,sjis");

/ *****エスケープ***** /
$user_d = mysql_escape_string($user_d);
$msg_d = mysql_escape_string($msg_d);

/ *****「user」にデータがあるときデータをDBに挿入***** /
if($user_d !== ""){
	mysql_query("INSERT INTO twi_tb (user,msg) VALUES ('$user_d','$msg_d')");
}

/ *****レコード削除***** /
$dele_d = $_POST["delete"];
mysql_query("DELETE FROM twi_tb WHERE id = $dele_d");

/ *****テーブル表示***** /
echo "";
echo "";
echo "id";
echo "time";
echo "user";
echo "msg";
echo "delete";
echo "";

/ *****タグ削除、twi_tbの全データ表示***** /
$re = mysql_query("SELECT * FROM twi_tb");
while($arr = mysql_fetch_array($re)){
	echo "";
	echo "".htmlspecialchars($arr[0])."";
	echo "".htmlspecialchars($arr[1])."";
	echo "".htmlspecialchars($arr[2])."";
	echo "".htmlspecialchars($arr[3])."";

/ *****削除フォーム作成***** /
	echo "";
	echo "";
	echo "$arr[0]' />";
	echo "";
	echo "";
	echo "";
}

/ *****テーブル終了***** /
echo "";

/ *****DB切断***** /
mysql_close($con);

?>

body>
```
