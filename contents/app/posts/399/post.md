---
title: dry-validationで設定ファイルを検証する
time: 2020-02-13 12:50
tags: ["ruby"]
---

Rubyでちょっとしたツールを作ったとき、設定ファイルの検証に[dry-validation](https://github.com/dry-rb/dry-validation)を使ってたら便利だった。

こんな感じのYAML形式の設定ファイルがあったとする。

```yaml
database:
  host: localhost
  port: 80
```

この設定ファイルのスキーマをDSLを使って定義できる。

```ruby
class ConfigContract < Dry::Validation::Contract
  json do
    required(:database).hash do
      required(:host).value(:string)
      required(:port).value(:integer)
    end
  end

  rule(database: :host) do
    key.failure("must not be localhost") if value == "localhost"
  end

  rule(database: :port) do
    key.failure("must not use well-known port") if value < 1024
  end
end
```

このスキーマを使って設定ファイルを検証してみる。

```ruby
config = YAML.load_file("./config.yml")
result = ConfigContract.new.call(config)
puts result.errors.to_h
#=> {:database=>{:host=>["must not be localhost"], :port=>["must not use well-known port"]}}
```

DSLについてはdry-validationやdry-schemaのドキュメントを眺めたり、ドキュメントにないDSLはソースコードを眺めてみるといい。
