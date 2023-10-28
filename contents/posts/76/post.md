---
title: plistから数値を読み込む
time: 2011-08-17 22:30
tags: ['ios']
---

```
NSString *path = [[NSBundle mainBundle] pathForResource:@"places" ofType:@"plist"];
placesDictionary = [[NSDictionary alloc] initWithContentsOfFile:path];
NSArray *places = [placesDictionary objectForKey:@"places"];
NSDictionary *place = [places objectAtIndex:indexPath.row];
NSNumber *lat = [place objectForKey:@"latitude"];
NSNumber *lng = [place objectForKey:@"longitude"];

PlaceAppDelegate *appDelegate = (PlaceAppDelegate *) [[UIApplication sharedApplication] delegate];
appDelegate.latitude = [lat doubleValue];
appDelegate.longitude = [lng doubleValue];
```

- (id)objectForKey:(id)aKeyはid型を返すので、doubleなどプリミティブ型に直接入れることができない
- 数値をオブジェクトとして扱うためにNSNumberを使う
- NSNumberを通してプリミティブ型に変換する

```
xml version="1.0" encoding="UTF-8"?>
DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
version="1.0">

	places
	
		
			name
			Tokyo
			latitude
			35.689488
			longitude
			139.691706
		
		
			name
			New York
			latitude
			40.714353
			longitude
			-74.005973
		
		
			name
			London
			latitude
			51.500152
			longitude
			-0.126236
```
