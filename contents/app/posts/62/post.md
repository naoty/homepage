---
title: アプリ起動時にログイン画面を表示させる
time: 2011-06-21 00:55
tags: ['titanium']
---

```
// app.js
Titanium.UI.setBackgroundColor('#000');

var tabGroup = Titanium.UI.createTabGroup();

var win1 = Titanium.UI.createWindow({
	url: 'map.js',
	navBarHidden: true
});
var tab1 = Titanium.UI.createTab({
	title: 'Map',
	icon: 'dark_pin.png',
	window: win1
});

var win2 = Titanium.UI.createWindow({
	url: 'list.js',
	navBarHidden: true
});
var tab2 = Titanium.UI.createTab({
	title: 'List',
	icon: 'dark_list.png',
	window: win2
});

var win3 = Titanium.UI.createWindow({
	url: 'registration.js',
	navBarHidden: true
});

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);

tabGroup.addEventListener('open', function (e) {
	win3.open({
		modal: true,
		modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
	});
});

tabGroup.open();
```

```
// registration.js
var win = Titanium.UI.currentWindow;
win.backgroundColor = '#fff';

var button = Titanium.UI.createButton({
	title: 'Close',
	top: 150,
	width: 100,
	height: 50
});

button.addEventListener('click', function (e) {
	win.close();
});

win.add(button);
```

- window.open()の引数にmodalを指定することで、モーダルウィンドウを実装できる。
- tabGroupのopenイベントでログイン画面をopenさせる。
- ログインしているかによって、モーダルウィンドウをopenするかを切り替えればおｋ
- Titanium.UI.iPhone.MODAL\_TRANSITION\_STYLE\_FLIP\_HORIZONTALはクルッと横回転するアニメーション。ほかにもいくつかある。
- ログイン画面はcloseすれば、クルッと回転して元の画面が表示される（tabGroupがopenされる）。
