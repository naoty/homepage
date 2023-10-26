---
title: 掲示板 ver.1.2
time: 2010-06-19 04:32
tags: ['php']
---

　前回のLv.1.1は文字化けするので、修正しました。修正点はこちら。

- htmlspecialcharsしてからDB書き込みは文字化けの原因なので、表示前に移動
- SQLインジェクション対策でmysql\_escape\_stringを追加

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

/ *****エスケープ***** /
$name_d = mysql_escape_string($_POST["name"]);
$msg_d = mysql_escape_string($_POST["msg"]);

/ *****utf-8にエンコーディング***** /
$name_d = mb_convert_encoding($name_d,"utf-8","utf-8,euc-jp,sjis");
$msg_d = mb_convert_encoding($msg_d,"utf-8","utf-8,euc-jp,sjis");

/ *****「name」にデータがあるときデータをDBに挿入***** /
if($name_d !== ""){
	mysql_query("INSERT INTO twi_tb (name,msg) VALUES ('$name_d','$msg_d')");
}

/ *****タグ削除、twi_tbの全データ表示***** /
$re = mysql_query("SELECT * FROM twi_tb");
while($arr = mysql_fetch_array($re)){
	echo htmlspecialchars($arr[0]);
	echo "：";
	echo htmlspecialchars($arr[1]);
	echo "：";
	echo htmlspecialchars($arr[2]);
	echo "：";
	echo htmlspecialchars($arr[3]);
	echo "";
}

/ *****DB切断***** /
mysql_close($con);

?>

body>
```
