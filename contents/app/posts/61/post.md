---
title: 基本的なログインフォーム
time: 2011-06-16 22:57
tags: ['titanium']
---

[![f:id:naoty_k:20110616225637p:image](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20110616/20110616225637.png "f:id:naoty\_k:20110616225637p:image")](http://f.hatena.ne.jp/naoty_k/20110616225637)

```
var win = Titanium.UI.currentWindow;

var title = Titanium.UI.createLabel({
	text: 'TestApp',
	top: 100,
	height: 40,
	color: '#008800',
	font: {fontSize: 40},
	textAlign: 'center'
});
var usernameForm = Titanium.UI.createTextField({
	hintText: 'Username',
	top: 200,
	width: 250,
	height: 40,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	returnKeyType: Titanium.UI.RETURNKEY_NEXT,
	autocapitalization: false
});
var passwordForm = Titanium.UI.createTextField({
	hintText: 'Password',
	top: 250,
	width: 250,
	height: 40,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	returnKeyType: Titanium.UI.RETURNKEY_NEXT,
	passwordMask: true
});
var confirmationForm = Titanium.UI.createTextField({
	hintText: 'Confirmation',
	top: 300,
	width: 250,
	height: 40,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	returnKeyType: Titanium.UI.RETURNKEY_GO,
	passwordMask: true
});
var button = Titanium.UI.createButton({
	title: 'Sign in',
	top: 350,
	width: 100,
	height: 40
});

win.add(title);
win.add(usernameForm);
win.add(passwordForm);
win.add(confirmationForm);
win.add(button);
```
