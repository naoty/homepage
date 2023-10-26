---
title: Titanium Mobileで現在地を表示する
time: 2011-06-12 23:51
tags: ['titanium']
---

```
var win = Titanium.UI.currentWindow;
// Titanium.Map.createViewで地図表示部品MapViewを作成する
var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    animate: true,
    regionFit: true,
    userLocation: true
});
win.add(mapview);

if (Titanium.Geolocation.locationServicesEnabled) {
    // 継続的な位置測定にはlocationイベントを用いる
    Titanium.Geolocation.addEventListener('location', funtion (e){
        // e.errorにエラー時のプロパティがセットされる
        if (!e.success || e.error) {
            alert('error: ' + JSON.stringify(e.error));
            return;
        }
        // e.coordsに位置情報のプロパティがセットされる
        var lat = e.coords.latitude;
        var lon = e.coords.longitude;
        // latitude, longitudeを動的に指定
        mapview.region = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
        };
    });
}
```
