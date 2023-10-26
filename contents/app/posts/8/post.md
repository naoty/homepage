---
title: sql_request ver.2
time: 2010-06-23 05:26
tags: ['php']
---

　SQL文を簡単に実行するためのユーザー定義関数を改良しました。非常に便利。ini.phpにDBの基本情報をいれてあります。

```
require_once("ini.php");

function sql_request($sql){
	$con = mysql_connect(DB_HOST,DB_USER,DB_PASS);
	mysql_select_db(DB_NAME);
	$resource = mysql_query($sql);
	if(($resource !== true) && ($resource !== false)){
		$return = array();
		while($arr = mysql_fetch_array($resource)){
			$return[] = $arr;
		}
		mysql_close($con);
		return $return;
	}elseif($resource == true){
		mysql_close($con);
		return true;
	}elseif($resource == false){
		mysql_close($con);
		return false;
	}
}

?>
```
