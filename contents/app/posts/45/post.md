---
title: Google Maps APIとTwitter APIのマッシュアップ
time: 2011-03-20 19:54
tags: ['javascript']
---

　Google Maps API v3で入力した場所名あるいは住所から緯度経度を取得し、Twitter APIでその緯度経度を使ってタイムラインを検索するアプリを作ったので、その記録。実物はここで見れる。

<script type="text/javascript" src="http://jsdo.it/blogparts/rK4I/js?view=design"></script>

[タイムライン場所検索 - jsdo.it - share JavaScript, HTML5 and CSS](http://jsdo.it/naoty/rK4I "タイムライン場所検索")

JavaScript

```
// Google Maps API V3
// Twitter API

$(function () {

// initialize
$('#options').hide();

// events
$('#search').click(function (e) {
	e.preventDefault();
	getLatLng($('#address').val()); // (1)
}).click();
$('#option').click(function (e) {
	e.preventDefault();
	$('#options').slideToggle(); // (2)
});

// functions
function getLatLng(place) {
	var geocoder = new google.maps.Geocoder(); // (3)
	geocoder.geocode({ // (4)
		address: place
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var latlng = results[0].geometry.location; // (5)
			searchTimeline(latlng.lat(), latlng.lng()); // (1)
		} else {
			alert('Geocode is not successful for the following reason: ' + status);
		}
	});
}

function searchTimeline(lat, lng) {
	var radius = $('#radius').val() || 10;
	$.ajax({
		type: 'GET',
		url: 'http://search.twitter.com/search.json',
		data: {
			q: $('#keyword').val(),
			geocode: lat + ',' + lng + ',' + radius + 'km', // (6)
			rpp: $('#number').val() || 10
		},
		dataType: 'jsonp',
		success: function (data) {
			var timeline = [];
			$.each(data.results, function () {
				var user = ' + this.from_user + '" target="_blank">' + this.from_user + '';
				var datetime = ' + this.from_user + '/status/' + this.id_str + '" target="_blank">' + formatTime(this.created_at) + '';
				var text = this.text
					.replace(/(http:\S+)/g, '$1')
					.replace(/@([^\s:]+)/g, '@$1')
					.replace(/#(\S+)/g, '#$1');
				timeline.push([
					'',
						'' + ' + this.profile_image_url + '" />',
						'' + user + '',
						'' + datetime + '',
						'' + text + '',
					''
				].join('')); // (7)
			});
			$('#timeline').html(timeline.join(''));
		}
	});
}

function formatTime(time) {
	var createdAt = time.split(' ');
	var datetime = new Date(createdAt[2] + ' ' + createdAt[1] + ', ' + createdAt[3] + ' ' + createdAt[4]);
	datetime.setHours(datetime.getHours() + 9);
	return datetime.toLocaleString();
}

});
```

(1)　緯度経度を取得した後にタイムライン検索を行うには、searchTimeline関数はgetLatLng関数のコールバックで呼び出す必要がある。以下のように記述すると、searchTimeline関数がgetLatLng関数内のAjax通信と同時に実行されるために、緯度経度を渡すことができず失敗する。

```
// events
$('#search').click(function (e) {
	e.preventDefault();
	getLatLng($('#address').val());
	searchTimeline(lat, lng);
}).click();
```

(2)　オプション入力フォームの表示／非表示切り替え。slideToggle()関数は便利。  
(3)　Google Maps API v3では、住所と緯度経度の変換はgoogle.maps.Geocoderクラスを通じて行われる。そのため、まずGeocoderオブジェクトを生成する。  
(4)　Geocoder.geocode()関数は、第1引数にリクエストパラメータ、第2引数にコールバック関数をとる。この場合、入力された場所名あるいは住所をaddressというパラメータとしてリクエストを送信する。レスポンスでは、resultsにデータが、statusに通信結果が入っている。  
(5)　results.geometry.locationでlatlngオブジェクトを取得できる。latlng.lat()で緯度を、latlng.lng()で経度を取得できる。  
(6)　取得した緯度経度をタイムライン検索のリクエストパラメータにセットする。
