---
title: Cassandraでのページネーションの実装
time: 2021-10-24 23:07
tags: ["cassandra", "rails"]
---

Cassandraのさまざまな操作に使われるCQLは見た目こそSQLに似ているものの、実態はかなり異なるため、Cassandraとやり取りをおこなうアプリケーションを実装する際にはその差分をよく理解しておく必要がある。

今回はページネーションの実装について詳しく調べた。

# CQLでの実装
CQLには`LIMIT`はあるものの`OFFSET`がないため、SQLのようにページネーションを実装することができない。

# Native Protocol
Cassandraと各言語のDriverとのやり取りに関する仕様をまとめたNative Protocolには、ページネーションに関する仕様が含まれている（[リンク](https://github.com/apache/cassandra/blob/trunk/doc/native_protocol_v4.spec#L1009)）。

`result_page_size`を指定すると、クエリ結果を指定した値の行数にページを分割する。また、クエリ結果には`paging_state`と呼ばれる値が含まれており、それを使って次ページを取得できるようになっている。

# Railsでの実装
Ruby Driverを使ってRailsアプリケーションからCassandraへのクエリ結果をページネーションする例を考える。以下のようなテーブルからアクセスログを取得したいとする。

```sql
CREATE TABLE access_logs (
  day INT,
  time TIMESTAMP,
  path TEXT,
  method TEXT,
  PRIMARY KEY ((day), time)
) WITH CLUSTERING ORDER BY (time DESC);
```

`access_logs`テーブルにアクセスするためのmodelを以下のように実装する。

```ruby
# app/models/access_log.rb
class AccessLog < CassandraRecord
  class << self
    def where(day:, limit: 10, paging_state: nil)
      statement = session.prepare(<<~CQL)
        SELECT
          time, method, path
        FROM
          #{keyspace}.access_logs
        WHERE
          day = :day
      CQL

      session.execute(
        statement,
        arguments: { day: day.strftime("%Y%m%d").to_i },
        page_size: limit,
        paging_state: paging_state
      )
    end
  end
end
```

Native Protocolに従い`Session#execute`に`page_size`を渡すことでページネーションを有効にしている。また、`paging_state`を渡すことで次ページを取得できるようにしている。

親クラスの`CassandraRecord`でCassandraと接続するためのセットアップをRuby Driverで実装する。

```ruby
# app/models/cassandra_record.rb
class CassandraRecord
  class << self
    def session
      Thread.current[:cassandra_session] ||= cluster.connect(keyspace)
    end

    private

    def cluster
      ::Cassandra.cluster(
        hosts: ENV.fetch("CASSANDRA_HOSTS").split(",")
      )
    end

    def keyspace
      ENV.fetch("CASSANDRA_KEYSPACE")
    end
  end
end
```

次にcontrollerは以下のように実装する。

```ruby
class AccessLogsController < ApplicationController
  PAGING_STATE_SALT = "cc79c9014617e4b3d4fd2e7326619913"

  before_action :decrypt_paging_state

  def index
    result = AccessLog.where(
      day: Date.new(2021, 1, 1),
      paging_state: @paging_state
    )

    unless result.last_page?
      encrypted_paging_state = encryptor.encrypt_and_sign(result.paging_state)
      next_url = access_logs_url(paging_state: encrypted_paging_state)
      response.headers["Link"] = %[<#{next_url}>; rel="next"]
    end

    render json: result.map do |row|
      {
        time: row["time"],
        path: row["path"],
        method: row["method"],
      }
    end
  end

  private

  def decrypt_paging_state
    return if params[:paging_state].nil?
    @paging_state = encryptor.decrypt_and_verify(params[:paging_state])
  end

  def encryptor
    return @encryptor unless @encryptor.nil?

    key_generator = ActiveSupport::KeyGenerator.new(Rails.application.secret_key_base)
    length = ActiveSupport::MessageEncryptor.key_len
    key = key_generator.generate_key(PAGING_STATE_SALT, length)
    @encryptor = ActiveSupport::MessageEncryptor.new(key)
  end
end
```

クエリ結果に含まれる`paging_state`を`ActiveSupport::MessageEncryptor`を使い暗号化し次ページのクエリパラメータとして付与している。また、クエリパラメータの`paging_state`を復号しmodelに渡している。

`paging_state`にはCassandraに内部情報がエンコードされているため、外部に公開する際には暗号化することが推奨されている。`ActiveSupport::MessageEncryptor`はこのようなデータを暗号化、復号する用途に合っていそうなので使ってみた。

# traceで走査行数を確認する
Native Protocolを使ったページネーションが本当に一部の行のみを取得しているのか確認するため、traceを有効にする。

```ruby
# app/models/access_log.rb
class AccessLog < CassandraRecord
  class << self
    def where(day:, limit: 10, paging_state: nil)
      statement = session.prepare(<<~CQL)
        SELECT
          time, method, path
        FROM
          #{keyspace}.access_logs
        WHERE
          day = :day
      CQL
      arguments = { day: day.strftime("%Y%m%d").to_i }
      result = session.execute(
        statement,
        arguments: arguments,
        page_size: limit,
        paging_state: paging_state,
        trace: true
      )

      log_trace(result.execution_info.trace)

      result
    end

    private

    def log_trace(trace)
      return if trace.nil?

      Rails.logger.info "Cassandra trace"
      trace.events.each do |event|
        Rails.logger.info "  #{event.activity}"
      end
    end
  end
end
```

`Session#execute`に`trace: true`を渡すことでtraceを有効にしている。そして、traceで取得したアクティビティをログに出力すると以下のようになった。

```
Started GET "/access_logs?limit=1&paging_state=3FRoptnPMhywVQ3dLdDDj87slY0XshvxltQ%3D--7E6TsIMY7px87omJ--n8sLyC7y5qyU5Cm5L0wJ4Q%3D%3D" for 172.19.0.1 at 2021-10-24 13:07:03 +0000
Processing by AccessLogsController#index as */*
  Parameters: {"limit"=>"1", "paging_state"=>"3FRoptnPMhywVQ3dLdDDj87slY0XshvxltQ=--7E6TsIMY7px87omJ--n8sLyC7y5qyU5Cm5L0wJ4Q=="}
Cassandra trace
  Executing single-partition query on access_logs
  Acquiring sstable references
  Skipped 0/0 non-slice-intersecting sstables, included 0 due to tombstones
  Merged data from memtables and 0 sstables
  Read 1 live rows and 0 tombstone cells
Completed 200 OK in 116ms (Views: 1.2ms | Allocations: 1192)
```

`page_size`を1にした場合はたしかに1件のみreadしているようだ。
