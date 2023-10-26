---
title: canvasでお絵かき
time: 2011-03-25 23:32
tags: ['jquery']
---

　どうやらjsdo.itからそのままはてなダイアリーに埋め込みができるようになったみたいですね。

<script type="text/javascript" src="http://jsdo.it/blogparts/zV9A/js?view=design"></script>

[お絵かき - jsdo.it - share JavaScript, HTML5 and CSS](http://jsdo.it/naoty/zV9A "お絵かき")

　これを作るにあたってのポイントは2つでした。第一に、ドラッグの実装。第二に、マウスの動きに合わせて線を引くこと。

1.　ドラッグの実装

　mousedownイベント・mousemoveイベント・mouseupイベントを組み合わせ、ドラッグの状態をdragFlagという変数で管理することでドラッグを実装します。マウスが押されているとき、dragFlagはtrueとなっており、この状態ではdraw関数より線を引くことができます。マウスが押されていないとき、あるいはマウスが対象から離れたとき、dragFlagはfalseとなり、この状態では線を引くことはできません。

```
// jQuery v1.5.1
$canvas.mousedown(startDrawing);
$canvas.mousemove(draw);
$canvas.bind('mouseup mouseleave', endDrawing);

function startDrawing(event) {
    // set x and y
    dragFlag = true;
}

function draw(event) {
    if (dragFlag) {
        // draw
    }
}

function endDrawing() {
    dragFlag = false;
}
```

2.　マウスの動きに合わせて線を引く

　fromX, fromYとtoX, toYという2種類の座標の間に線を引き、これらの座標をmousemoveされる度に書き換えることでマウスの動きに合わせて線を引くことができます。マウスが押されたときの座標を出発点となる座標（fromX, fromY）にセットします。mousemoveすると、動いた先の座標を到達点となる座標（toX, toY）にセットして、出発点と到達点との間に線を引きます。その後、到達点の座標を出発点の座標にセットすることで、連続的に出発点と到達点をセットすることができるため、なめらかに線を引くことができるようになります。

```
function startDrawing(event) {
    fromX = event.pageX - $canvas.offset().left;
    fromY = event.pageY - $canvas.offset().top;
    dragFlag = true;
}

function draw(event) {
    if (dragFlag) {
        var toX = event.pageX - $canvas.offset().left,
            toY = event.pageY - $canvas.offset().top;
        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();
        fromX = toX;
        fromY = toY;
    }
}
```
