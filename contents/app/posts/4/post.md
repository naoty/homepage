---
title: 掲示板 ver.1.1
time: 2010-06-18 03:18
tags: ['php']
---

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

/ *****タグ削除***** /
$name_d = htmlspecialchars($_POST["name"]);
$msg_d = htmlspecialchars($_POST["msg"]);

/ *****utf-8にエンコーディング***** /
$name_d = mb_convert_encoding($name_d,"utf-8");
$msg_d = mb_convert_encoding($msg_d,"utf-8");

/ *****「name」にデータがあるときデータをDBに挿入***** /
if($name_d<>""){
	mysql_query("INSERT INTO twi_tb (name,msg) VALUES ('$name_d','$msg_d')");
}

/ *****twi_tbの全データ表示***** /
$re = mysql_query("SELECT * FROM twi_tb");
$arr = mysql_fetch_array($re);
for($i=0;$i<count($arr);$i++){
	echo $arr[$i][0].$arr[$i][1].$arr[$i][2].$arr[$i][3];
}

/ *****DB切断***** /
mysql_close($con);

?>

body>
```
