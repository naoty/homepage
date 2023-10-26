---
title: アプリ（Titanium Mobile）とサーバー（Rails）間の通信
time: 2011-07-04 00:33
tags: ['titanium', 'rails']
---

```
# /app/controllers/users_controller.rb
class UsersController < ApplicationController  
  def signin
    @user = User.create({:name => params[:name], :password => params[:password]})
    respond_to do |format|
      format.json { render :json => @user.to_json }
    end
  end
end
```

- アプリ側からのリクエストを受けると、Userインスタンスを新しく作成します。ここでは、セキュリティ面の実装は無視しています。
- jsonでレスポンスを返したいので、インスタンスをto\_jsonでjson化したものをformat.jsonで返します。

```
// /Resources/signin.js
button.addEventListener('click', function () {
	var username = usernameForm.value;
	var password = passwordForm.value;
	var confirmation = confirmationForm.value;
	
	if (username === '' || password === '' || confirmation === '') {
		Titanium.API.debug('form is blank.');
		return;
	}
	if (password !== confirmation) {
		Titanium.API.debug('confirmation is wrong.');
		return;
	}
	
	var xhr = Titanium.Network.createHTTPClient();
	xhr.open('PUT', 'http://localhost:3000/users/signin.json');
	xhr.onload = function () {
		var user = JSON.parse(this.responseText);
		Titanium.App.Properties.setString('name', user.name);
		Titanium.App.Properties.setString('password', user.password);
		Titanium.App.Properties.setInt('id', user._id);
		win.close();
	};
	xhr.send({
		'name': username,
		'password': password
	});
});
```

- 会員登録画面をつくったつもりです。このコードはそのボタン部分の抜粋です。
- サーバーにリクエストする前に最低限の検証をおこなっておきます。ひっかかったら、フォームの背景色を赤にするなど、目立たせる処理も実装するといいっすねー。
- Titanium.Network.HTTPClientを使って、サーバー側と非同期通信します。
- jsonでレスポンスを返してもらいたいので、URLの末尾に「.json」をつけておきます。
- Titanium.Network.HTTPClient.onloadはレスポンスが正常に返ってきた際の処理です。jsonで返ってくるので、JSON.parse()でJavaScriptのオブジェクトに変換します。
- Titanium.App.Propertiesで、アプリ側に変数を保持しておくことができます。ブラウザでいうところのクッキーみたいな使い方ができるので便利です。
- Titanium.Network.HTTPClient.send()は引数にパラメータをもつことができるので、この場合だと、ユーザー名とパスワードをオブジェクトのプロパティとしてセットします。
