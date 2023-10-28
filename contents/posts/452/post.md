---
title: isucon11-priorでisuconの練習をした2
time: 2021-07-12 08:33
tags: ["isucon"]
---

* [その1](/451/)
* その2

# Redisで予約数を管理する
予約数をMySQLではなくRedisで管理することで高速化できないか試してみる。

すでにRedisはセットアップされているので起動する。

```bash
isucon@ubuntu-focal:~$ sudo systemctl start redis-server
```

バルクでの取得を高速化するためにredisとともにhiredisをセットアップする。

```diff
+gem 'redis'
+gem 'hiredis'
```

```diff
 class App < Sinatra::Base
   helpers do
     # snip

+    def redis
+      Thread.current[:redis] ||= Redis.new(driver: :hiredis)
+    end

     # snip
   end
 end
```

`POST /initialize`でデータが初期化されるようにする。

```diff
 post '/initialize' do
   transaction do |tx|
     tx.query('TRUNCATE `reservations`')
     tx.query('TRUNCATE `schedules`')
     tx.query('TRUNCATE `users`')
 
     id = generate_id('users', tx)
     tx.xquery('INSERT INTO `users` (`id`, `email`, `nickname`, `staff`, `created_at`) VALUES (?, ?, ?, true, NOW(6))', id, 'isucon2021_
   end
 
+  redis.flushall
+
   json(language: 'ruby')
 end
```

`POST /api/reservations`で予約数をインクリメントし、予約数をRedisから取得するようにする。

```diff
 post '/api/reservations' do
   required_login!

   transaction do |tx|
     id = generate_id('reservations', tx)
     schedule_id = params[:schedule_id].to_s
     user_id = current_user[:id]

     halt(403, JSON.generate(error: 'schedule not found')) if tx.xquery('SELECT 1 FROM `schedules` WHERE `id` = ? LIMIT 1', schedule_id)
     halt(403, JSON.generate(error: 'already taken')) if tx.xquery('SELECT 1 FROM `reservations` WHERE `schedule_id` = ? AND `user_id` =

     capacity = tx.xquery('SELECT `capacity` FROM `schedules` WHERE `id` = ? LIMIT 1', schedule_id).first[:capacity]
-    reserved = tx.xquery('SELECT COUNT(*) AS count FROM `reservations` WHERE `schedule_id` = ?', schedule_id).first[:count]
+    reserved = redis.get("schedules:#{schedule_id}:reserved").to_i

     halt(403, JSON.generate(error: 'capacity is already full')) if reserved >= capacity

     tx.xquery('INSERT INTO `reservations` (`id`, `schedule_id`, `user_id`, `created_at`) VALUES (?, ?, ?, NOW(6))', id, schedule_id, us
     created_at = tx.xquery('SELECT `created_at` FROM `reservations` WHERE `id` = ?', id).first[:created_at]

+    redis.incr("schedules:#{schedule_id}:reserved")
+
     json({ id: id, schedule_id: schedule_id, user_id: user_id, created_at: created_at})
   end
 end
```

`GET /api/schedules`でRedisから予約数をまとめて取得するようにする。

```diff
 get '/api/schedules' do
   schedules = db.xquery('SELECT * FROM `schedules` ORDER BY `id` DESC')
-  schedules.each do |schedule|
-    get_reservations_count(schedule)
-  end
+  reserved_keys = schedules.map { |schedule| "schedules:#{schedule[:id]}:reserved" }
+  reserved_counts = reserved_keys.empty? ? {} : redis.mapped_mget(*reserved_keys)
+  schedules.each do |schedule|
+    schedule[:reserved] = reserved_counts["schedules:#{schedule[:id]}:reserved"].to_i
+  end

   if current_user.nil? || !current_user[:staff]
     schedules = schedules.select { |schedule| schedule[:capacity] > schedule[:reserved] }
   end

   json(schedules.to_a)
 end
```

ベンチマークの結果はそこまで変化がなかった。

```bash
09:34:48.277101 score: 1951(1953 - 2) : pass
09:34:48.277114 deduction: 2 / timeout: 0
```

# JSONエンコーダーの変更
flamegraphを見ると、JSONの生成で時間がかかっていることがわかる。

```diff
 require 'sinatra/json'
-require 'active_support/json'
 require 'active_support/time'
 require_relative 'db'
```

```diff
 set :session_secret, 'tagomoris'
 set :sessions, key: 'session_isucon2021_prior', expire_after: 3600
 set :show_exceptions, false
-set :json_encoder, ActiveSupport::JSON
+set :json_encoder, :to_json
```

すると、JSONのフォーマットがinvalidというエラーが出てしまった。

```bash
22:03:47.963385 ERR: prepare: json: invalid JSON at /api/login
22:03:47.964026 score: 0(0 - 0) : fail: critical
22:03:47.964593 deduction: 0 / timeout: 0
```

`ActiveSupport::JSON.encode`と`JSON.generate`の仕様の差によるものと思われる。`Time#iso8601`を使って文字列に変換したものをJSONに渡すことでこの差分を埋めることができそう。

```ruby
puts ActiveSupport::JSON.encode()
#=> "{\"created_at\":\"2021-07-13T22:07:25.346+09:00\"}"
puts JSON.generate({ created_at: Time.now })
#=> "{\"created_at\":\"2021-07-13 22:07:12 +0900\"}"
puts JSON.generate({ created_at: Time.now.iso8601(3) })
#=> "{\"created_at\":\"2021-07-13T22:11:44.003+09:00\"}"
```

レスポンスに渡している`created_at`を`created_at.iso8601(3)`として形式を変換した。

ベンチマークをとるとスコアが上がった。

```bash
22:20:27.911849 score: 2103(2103 - 0) : pass
22:20:27.911866 deduction: 0 / timeout: 0
```

# POST /api/reservations
JSONの修正によってflamegraphの形が大きく変わった。次はどうやら予約の作成に時間がかかっているようなので、再度見直してみる。

`created_at`を取得するためのクエリを省くためにRubyで生成した現在時刻を使い回すようにした。

```diff
-tx.xquery('INSERT INTO `reservations` (`id`, `schedule_id`, `user_id`, `created_at`) VALUES (?, ?, ?, NOW(6))', id, schedule_id, user_id)
-created_at = tx.xquery('SELECT `created_at` FROM `reservations` WHERE `id` = ?', id).first[:created_at]
+created_at = Time.now
+tx.xquery('INSERT INTO `reservations` (`id`, `schedule_id`, `user_id`, `created_at`) VALUES (?, ?, ?, ?)', id, schedule_id, user_id, created_at.iso8601(6))
```

```bash
09:08:25.905845 score: 2225(2225 - 0) : pass
09:08:25.905860 deduction: 0 / timeout: 0
```

スケジュールを2回取得していたので1回にする。

```diff
-halt(403, JSON.generate(error: 'schedule not found')) if tx.xquery('SELECT 1 FROM `schedules` WHERE `id` = ? LIMIT 1', schedule_id).first.nil?
+schedule = tx.xquery('SELECT `capacity` FROM `schedules` WHERE `id` = ? LIMIT 1', schedule_id).first
+halt(403, JSON.generate(error: 'schedule not found')) if schedule.nil?
 halt(403, JSON.generate(error: 'already taken')) if tx.xquery('SELECT 1 FROM `reservations` WHERE `schedule_id` = ? AND `user_id` = ? LIMIT 1', schedule_id, user_id).first

-capacity = tx.xquery('SELECT `capacity` FROM `schedules` WHERE `id` = ? LIMIT 1', schedule_id).first[:capacity]
 reserved = redis.get("schedules:#{schedule_id}:reserved").to_i

-halt(403, JSON.generate(error: 'capacity is already full')) if reserved >= capacity
+halt(403, JSON.generate(error: 'capacity is already full')) if reserved >= schedule[:capacity]
```

```
09:09:39.008965 ERR: load: invalid: 存在しないはずのスケジュール ID です: 01FAH5HZDT68S0519B4PNJBFX6
09:09:39.499605 ERR: load: invalid: 存在しないはずのスケジュール ID です: 01FAH5HZX6YW4S72110SHX75SF
09:10:48.801984 ERR: validation: invalid: overbooking at 01FAH5HZRE7F7C0TFQ0J269Z1P
09:10:49.004425 score: 2255(2307 - 52) : pass
09:10:49.004439 deduction: 52 / timeout: 0
```

# GET /api/schedules/:id
次にスケジュールと予約しているユーザーの取得にやはり時間がかかっているため、再度見直す。

コード自体は変更できそうなところはないので、今までは保留していたけど、予約テーブルにインデックスを追加することで改善しないか試してみる。

```diff
 CREATE TABLE `reservations` (
   `id`          VARCHAR(255) PRIMARY KEY NOT NULL,
   `schedule_id` VARCHAR(255) NOT NULL,
   `user_id`     VARCHAR(255) NOT NULL,
-  `created_at`  DATETIME(6) NOT NULL
+  `created_at`  DATETIME(6) NOT NULL,
+  KEY (`schedule_id`)
 ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;
```

大きな変化は見られなかった。

```bash
09:38:16.792266 ERR: load: invalid: 存在しないはずのスケジュール ID です: 01FAH76CYJPV68QY935P3SJ2EB
09:38:16.941098 ERR: load: invalid: 存在しないはずのスケジュール ID です: 01FAH76D325T6CFGBHGDB03JMS
09:38:16.950073 ERR: load: invalid: 存在しないはずのスケジュール ID です: 01FAH76D325T6CFGBHGDB03JMS
09:39:26.331983 score: 2222(2225 - 3) : pass
09:39:26.331998 deduction: 3 / timeout: 0
```

`EXPLAIN`をしてみる。

```sql
mysql> explain select * from reservations join users on reservations.user_id = users.id where reservations.schedule_id = '01FAH77NGEVQ4Y9WDNYBCFN5PK';                  
+----+-------------+--------------+------------+--------+---------------+-------------+---------+---------------------------------------+------+----------+-------+
| id | select_type | table        | partitions | type   | possible_keys | key         | key_len | ref                                   | rows | filtered | Extra |
+----+-------------+--------------+------------+--------+---------------+-------------+---------+---------------------------------------+------+----------+-------+
|  1 | SIMPLE      | reservations | NULL       | ref    | schedule_id   | schedule_id | 1022    | const                                 |   20 |   100.00 | NULL  |
|  1 | SIMPLE      | users        | NULL       | eq_ref | PRIMARY       | PRIMARY     | 1022    | isucon2021_prior.reservations.user_id |    1 |   100.00 | NULL  |
+----+-------------+--------------+------------+--------+---------------+-------------+---------+---------------------------------------+------+----------+-------+
2 rows in set, 1 warning (0.00 sec)
```

`type`列を見ると`ref`となっているため、追加したインデックスが使われていることがわかる。

まだ改善できるところがないか探してみると、`key_len`がやや大きいように見える。これは`id`をULIDにしている影響と思われるため、すべてのテーブルの`id`を`int`型にし、`AUTO_INCREMENT`を設定する。

なお、マニュアルには

>各エンドポイントの URI の変更は認められませんが、以下の点については明確に許可されます。
>ID 発行形式の変更

とわざわざ書かれているため、問題ないはず。

```diff
 DROP TABLE IF EXISTS `users`;
 CREATE TABLE `users` (
-  `id`         VARCHAR(255) PRIMARY KEY NOT NULL,
+  `id`         INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
   `email`      VARCHAR(255) NOT NULL DEFAULT '',
   `nickname`   VARCHAR(120) NOT NULL DEFAULT '',
   `staff`      BOOLEAN NOT NULL DEFAULT false,
 ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

 DROP TABLE IF EXISTS `schedules`;
 CREATE TABLE `schedules` (
-  `id`         VARCHAR(255) PRIMARY KEY NOT NULL,
+  `id`         INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
   `title`      VARCHAR(255) NOT NULL DEFAULT '',
   `capacity`   INT UNSIGNED NOT NULL DEFAULT 0,
   `created_at` DATETIME(6) NOT NULL
 ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;

 DROP TABLE IF EXISTS `reservations`;
 CREATE TABLE `reservations` (
-  `id`          VARCHAR(255) PRIMARY KEY NOT NULL,
-  `schedule_id` VARCHAR(255) NOT NULL,
-  `user_id`     VARCHAR(255) NOT NULL,
+  `id`          INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
+  `schedule_id` INT NOT NULL,
+  `user_id`     INT NOT NULL,
   `created_at`  DATETIME(6) NOT NULL,
   KEY (`schedule_id`)
 ) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4;
```

ULIDを発番して挿入している箇所もすべてやめる。すると、validation errorになってしまった。

```bash
10:09:08.050628 ERR: prepare: json: invalid JSON at /api/login
10:09:08.052437 score: 0(0 - 0) : fail: critical
10:09:08.052819 deduction: 0 / timeout: 0
```

どうやらJSONの`id`フィールドを文字列にする必要がありそうなので、`to_s`しておく。

そこまでスコアは上がらなかった。

```bash
22:55:06.307661 ERR: validation: invalid: overbooking at 7
22:55:06.334715 score: 2205(2255 - 50) : pass
22:55:06.335481 deduction: 50 / timeout: 0
```

`EXPLAIN`の結果を見ると確かに`key_len`が小さくなった。

```sql
mysql> explain select * from reservations join users on reservations.user_id = users.id where reservations.schedule_id = 1;
+----+-------------+--------------+------------+--------+---------------+-------------+---------+---------------------------------------+------+----------+-------+
| id | select_type | table        | partitions | type   | possible_keys | key         | key_len | ref                                   | rows | filtered | Extra |
+----+-------------+--------------+------------+--------+---------------+-------------+---------+---------------------------------------+------+----------+-------+
|  1 | SIMPLE      | reservations | NULL       | ref    | schedule_id   | schedule_id | 4       | const                                 |   70 |   100.00 | NULL  |
|  1 | SIMPLE      | users        | NULL       | eq_ref | PRIMARY       | PRIMARY     | 4       | isucon2021_prior.reservations.user_id |    1 |   100.00 | NULL  |
+----+-------------+--------------+------------+--------+---------------+-------------+---------+---------------------------------------+------+----------+-------+
2 rows in set, 1 warning (0.00 sec)
```

# シナリオを調べる
視点を変えてログインユーザーがどのような行動をとっているのか調べてみることにした。そこで、アクセスログにユーザーIDを出力するようにする。

まず、sinatraでユーザーIDをレスポンスヘッダに追加する。

```diff
+if ENV['ENABLE_PROFILE'].to_i.nonzero?
+  after do
+    response.headers['X-User-ID'] = session[:user_id]
+  end
+end
```

次にnginxのアクセスログにレスポンスヘッダの中身を出力する。`$upstream_http_<ヘッダ>`という形式でレスポンスヘッダの値に参照できる。

```diff
 log_format ltsv "time:$time_local"
   "\thost:$remote_addr"
   "\tforwardedfor:$http_x_forwarded_for"
   "\treq:$request"
   "\tmethod:$request_method"
   "\turi:$request_uri"
   "\tstatus:$status"
   "\tsize:$body_bytes_sent"
   "\treferer:$http_referer"
   "\tua:$http_user_agent"
   "\treqtime:$request_time"
   "\truntime:$upstream_http_x_runtime"
   "\tapptime:$upstream_response_time"
   "\tcache:$upstream_http_x_cache"
+  "\tuserid:$upstream_http_x_user_id"
   "\tvhost:$host"
```

ユーザー毎の行動をアクセスログから調べられるようになった。例えば、ユーザーID 1を持つ管理者はスケジュール一覧を大量に閲覧しており、各スケジュールに1回だけアクセスしているのがわかる。

```bash
isucon@ubuntu-focal:~$ sudo grep "userid:1[[:space:]]" /var/log/nginx/access.log | alp ltsv
+-------+-----+-----+-----+-----+-----+--------+-------------------+-------+-------+-------+-------+-------+-------+-------+--------+-----------+-----------+------------+-----------+
| COUNT | 1XX | 2XX | 3XX | 4XX | 5XX | METHOD |        URI        |  MIN  |  MAX  |  SUM  |  AVG  |  P1   |  P50  |  P99  | STDDEV | MIN(BODY) | MAX(BODY) | SUM(BODY)  | AVG(BODY) |
+-------+-----+-----+-----+-----+-----+--------+-------------------+-------+-------+-------+-------+-------+-------+-------+--------+-----------+-----------+------------+-----------+
|     1 |   0 |   1 |   0 |   0 |   0 | POST   | /api/login        | 0.008 | 0.008 | 0.008 | 0.008 | 0.008 | 0.008 | 0.008 |  0.000 |   108.000 |   108.000 |    108.000 |   108.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/4  | 0.156 | 0.156 | 0.156 | 0.156 | 0.156 | 0.156 | 0.156 |  0.000 |  8140.000 |  8140.000 |   8140.000 |  8140.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/2  | 0.152 | 0.152 | 0.152 | 0.152 | 0.152 | 0.152 | 0.152 |  0.000 | 20684.000 | 20684.000 |  20684.000 | 20684.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/7  | 0.140 | 0.140 | 0.140 | 0.140 | 0.140 | 0.140 | 0.140 |  0.000 |  9104.000 |  9104.000 |   9104.000 |  9104.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/1  | 0.004 | 0.004 | 0.004 | 0.004 | 0.004 | 0.004 | 0.004 |  0.000 | 15758.000 | 15758.000 |  15758.000 | 15758.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/22 | 0.012 | 0.012 | 0.012 | 0.012 | 0.012 | 0.012 | 0.012 |  0.000 |   132.000 |   132.000 |    132.000 |   132.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/19 | 0.016 | 0.016 | 0.016 | 0.016 | 0.016 | 0.016 | 0.016 |  0.000 |  6464.000 |  6464.000 |   6464.000 |  6464.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/20 | 0.024 | 0.024 | 0.024 | 0.024 | 0.024 | 0.024 | 0.024 |  0.000 |  5570.000 |  5570.000 |   5570.000 |  5570.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/18 | 0.036 | 0.036 | 0.036 | 0.036 | 0.036 | 0.036 | 0.036 |  0.000 |  8765.000 |  8765.000 |   8765.000 |  8765.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/21 | 0.040 | 0.040 | 0.040 | 0.040 | 0.040 | 0.040 | 0.040 |  0.000 |  2408.000 |  2408.000 |   2408.000 |  2408.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/16 | 0.044 | 0.044 | 0.044 | 0.044 | 0.044 | 0.044 | 0.044 |  0.000 | 10125.000 | 10125.000 |  10125.000 | 10125.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/17 | 0.056 | 0.056 | 0.056 | 0.056 | 0.056 | 0.056 | 0.056 |  0.000 | 10333.000 | 10333.000 |  10333.000 | 10333.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/15 | 0.068 | 0.068 | 0.068 | 0.068 | 0.068 | 0.068 | 0.068 |  0.000 | 16018.000 | 16018.000 |  16018.000 | 16018.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/12 | 0.076 | 0.076 | 0.076 | 0.076 | 0.076 | 0.076 | 0.076 |  0.000 | 16046.000 | 16046.000 |  16046.000 | 16046.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/14 | 0.076 | 0.076 | 0.076 | 0.076 | 0.076 | 0.076 | 0.076 |  0.000 | 13767.000 | 13767.000 |  13767.000 | 13767.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/13 | 0.088 | 0.088 | 0.088 | 0.088 | 0.088 | 0.088 | 0.088 |  0.000 |  8788.000 |  8788.000 |   8788.000 |  8788.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/9  | 0.100 | 0.100 | 0.100 | 0.100 | 0.100 | 0.100 | 0.100 |  0.000 | 10721.000 | 10721.000 |  10721.000 | 10721.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/10 | 0.108 | 0.108 | 0.108 | 0.108 | 0.108 | 0.108 | 0.108 |  0.000 | 11670.000 | 11670.000 |  11670.000 | 11670.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/8  | 0.120 | 0.120 | 0.120 | 0.120 | 0.120 | 0.120 | 0.120 |  0.000 | 22467.000 | 22467.000 |  22467.000 | 22467.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/6  | 0.128 | 0.128 | 0.128 | 0.128 | 0.128 | 0.128 | 0.128 |  0.000 | 19817.000 | 19817.000 |  19817.000 | 19817.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/11 | 0.132 | 0.132 | 0.132 | 0.132 | 0.132 | 0.132 | 0.132 |  0.000 | 26703.000 | 26703.000 |  26703.000 | 26703.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/5  | 0.132 | 0.132 | 0.132 | 0.132 | 0.132 | 0.132 | 0.132 |  0.000 | 21596.000 | 21596.000 |  21596.000 | 21596.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/3  | 0.156 | 0.156 | 0.156 | 0.156 | 0.156 | 0.156 | 0.156 |  0.000 | 16882.000 | 16882.000 |  16882.000 | 16882.000 |
|    22 |   0 |  22 |   0 |   0 |   0 | POST   | /api/schedules    | 0.004 | 0.152 | 0.576 | 0.026 | 0.068 | 0.012 | 0.008 |  0.032 |   100.000 |   111.000 |   2306.000 |   104.818 |
|   365 |   0 | 365 |   0 |   0 |   0 | GET    | /api/schedules    | 0.000 | 0.320 | 6.344 | 0.017 | 0.000 | 0.008 | 0.000 |  0.032 |     2.000 |  2505.000 | 561496.000 |  1538.345 |
|   365 |   0 |   0 |   0 | 365 |   0 | GET    | /favicon.ico      | 0.004 | 0.272 | 3.808 | 0.010 | 0.052 | 0.004 | 0.000 |  0.023 |   377.000 |   377.000 | 137605.000 |   377.000 |
+-------+-----+-----+-----+-----+-----+--------+-------------------+-------+-------+-------+-------+-------+-------+-------+--------+-----------+-----------+------------+-----------+
```

管理者ではない一般ユーザーはスケジュール一覧を1回だけ見て、各スケジュールにアクセスして予約をとっているのがわかる。

```bash
isucon@ubuntu-focal:~$ sudo grep "userid:100[[:space:]]" /var/log/nginx/access.log | alp ltsv
+-------+-----+-----+-----+-----+-----+--------+-------------------+-------+-------+-------+-------+-------+-------+-------+--------+-----------+-----------+-----------+-----------+
| COUNT | 1XX | 2XX | 3XX | 4XX | 5XX | METHOD |        URI        |  MIN  |  MAX  |  SUM  |  AVG  |  P1   |  P50  |  P99  | STDDEV | MIN(BODY) | MAX(BODY) | SUM(BODY) | AVG(BODY) |
+-------+-----+-----+-----+-----+-----+--------+-------------------+-------+-------+-------+-------+-------+-------+-------+--------+-----------+-----------+-----------+-----------+
|     1 |   0 |   1 |   0 |   0 |   0 | POST   | /api/login        | 0.052 | 0.052 | 0.052 | 0.052 | 0.052 | 0.052 | 0.052 |  0.000 |   112.000 |   112.000 |   112.000 |   112.000 |
|     1 |   0 |   0 |   0 |   1 |   0 | GET    | /favicon.ico      | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |  0.000 |   377.000 |   377.000 |   377.000 |   377.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules    | 0.008 | 0.008 | 0.008 | 0.008 | 0.008 | 0.008 | 0.008 |  0.000 |   675.000 |   675.000 |   675.000 |   675.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/10 | 0.004 | 0.004 | 0.004 | 0.004 | 0.004 | 0.004 | 0.004 |  0.000 |  1311.000 |  1311.000 |  1311.000 |  1311.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/9  | 0.020 | 0.020 | 0.020 | 0.020 | 0.020 | 0.020 | 0.020 |  0.000 |  1705.000 |  1705.000 |  1705.000 |  1705.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/8  | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |  0.000 |  2482.000 |  2482.000 |  2482.000 |  2482.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/6  | 0.020 | 0.020 | 0.020 | 0.020 | 0.020 | 0.020 | 0.020 |  0.000 | 16049.000 | 16049.000 | 16049.000 | 16049.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/5  | 0.060 | 0.060 | 0.060 | 0.060 | 0.060 | 0.060 | 0.060 |  0.000 | 16436.000 | 16436.000 | 16436.000 | 16436.000 |
|     1 |   0 |   1 |   0 |   0 |   0 | GET    | /api/schedules/2  | 0.028 | 0.028 | 0.028 | 0.028 | 0.028 | 0.028 | 0.028 |  0.000 | 16430.000 | 16430.000 | 16430.000 | 16430.000 |
|     6 |   0 |   6 |   0 |   0 |   0 | POST   | /api/reservations | 0.004 | 0.060 | 0.128 | 0.021 | 0.016 | 0.024 | 0.060 |  0.018 |    87.000 |    88.000 |   523.000 |    87.167 |
+-------+-----+-----+-----+-----+-----+--------+-------------------+-------+-------+-------+-------+-------+-------+-------+--------+-----------+-----------+-----------+-----------+
```

`GET /api/schedules`が管理者から大量にアクセスされているけど、予約数を出す以上はキャッシュすることも難しそう。特にこれといって方針が決まるかと言うとそこまでではなさそうだった。

# GET /favicon.ico
alpによるプロファイリング結果を見ていると`GET /favicon.ico`へのアクセスがそれなりに遅いことがわかる。試しに`curl`でリクエストを送ると、sinatraから返していることがわかる。

```bash
isucon@ubuntu-focal:~$ curl localhost/favicon.ico
<!DOCTYPE html>
<html>
<head>
  <style type="text/css">
  body { text-align:center;font-family:helvetica,arial;font-size:22px;
    color:#888;margin:20px}
  #c {margin:0 auto;width:500px;text-align:left}
  </style>
</head>
<body>
  <h2>Sinatra doesn’t know this ditty.</h2>
  <img src='http://localhost/__sinatra__/404.png'>
  <div id="c">
    Try this:
    <pre># in app.rb
class App
  get &#x27;&#x2F;favicon.ico&#x27; do
    &quot;Hello World&quot;
  end
end
</pre>
  </div>
</body>
</html>
```

そこで、nginxから404を返すように変更する。

```diff
+# favicon
+location = /favicon.ico {
+  return 404;
+}
```

nginxの404ページが返るようになった。

```bash
isucon@ubuntu-focal:~/webapp/ruby$ curl localhost/favicon.ico
<html>
<head><title>404 Not Found</title></head>
<body>
<center><h1>404 Not Found</h1></center>
<hr><center>nginx/1.18.0 (Ubuntu)</center>
</body>
</html>
```

スコアには特に影響しなかった。

```bash
10:00:28.076825 score: 2092(2092 - 0) : pass
10:00:28.076840 deduction: 0 / timeout: 0
```
