---
title: "`bin/webpack`を読んだ"
time: 2017-08-17 20:12
tags: ['rails']
---

webpackerを理解するため、`rails g webpacker:install`で追加される`bin/webpack`や設定の中身を読むことにした。

### `bin/webpack`

```
newenv = { "NODE_PATH" => NODE_MODULES_PATH.shellescape }
cmdline = ["yarn", "run", "webpack", "--", "--config", WEBPACK_CONFIG] + ARGV

Dir.chdir(APP_PATH) do
  exec newenv, *cmdline
end
```

- `bin/webpack`では実際には`yarn run webpack -- --config WEBPACK_CONFIG`を実行している。
- `WEBPACK_CONFIG`は`config/webpack/#{NODE_ENV}.js`となっているため、`config/webpack/development.js`などとなる。

### `config/webpack/development.js`

```
const sharedConfig = require('./shared.js')

module.exports = merge(sharedConfig, {
  // ...
})
```

- `config/webpack/shared.js`というファイルが環境ごとの設定ファイルでmergeされているようだ。

### `config/webpack/shared.js`

```
const { env, settings, output, loaderDir } = require('./configuration.js')
```

- `settings`は`config/webpacker.yml`をロードしたオブジェクトを参照している。
  - `settings.extensions`: `[.coffee, .erb, .js, .jsx, .ts, .vue, ...]`
  - `settings.source_path`: `app/javascript`
  - `settings.source_entry_path`: `packs`
- `output`は`path`と`publicPath`というプロパティをもったオブジェクトを参照している。
  - `path`: `public/packs`
  - `publicPath`: ‘/packs’
    - `ASSET_HOST`という環境変数を指定することでホストを変更できそう。
- `loadersDir`は`config/webpack/loaders/`を参照している。

```
const extensionGlob = `**/*{${settings.extensions.join(',')}}*`
const entryPath = join(settings.source_path, settings.source_entry_path)
const packPaths = sync(join(entryPath, extensionGlob))

module.exports = {
  entry: packPaths.reduce(
    // ...
  )
}
```

- `entry`はwebpackによってbundleされる対象のファイルを設定する。
- `sync`は[https://github.com/isaacs/node-glob](https://github.com/isaacs/node-glob)からexportされている。同期的にglobサーチをしている。
- ここでは、`app/javascript/packs/**/*{.coffee,.erb,.js,.jsx}*`のようなglobでファイルを検索し、マッチしたファイルのリストが`packPaths`に代入されている。
- **つまり、`app/javascript/packs/`以下の`settings.extensions`で指定された拡張子をもつファイルがwebpackによってbundleされるということになる。**

```
module.exports = {
  entry: packPaths.reduce(
    (map, entry) => {
      const localMap = map
      const namespace = relative(join(entryPath), dirname(entry))
      localMap[join(namespace, basename(entry, extname(entry)))] = resolve(entry)
      return localMap
    }, {}
  )
}
```

- `entry`にオブジェクトが指定された場合、プロパティごとにbundleされるファイルが分割される。`output.filename`で`[name]`と指定された箇所にプロパティ名が入る。

```
const { env, settings, output, loaderDir } = require('./configuration.js')

module.exports = {
  output: {
    filename: '[name].js',
    path: output.path,
    publicPath: output.publicPath
  }
}
```

- `output`はbundleされたファイルの出力先を設定する。
- `output.filename`でbundleされたファイル名を設定する。`entry`がオブジェクトで指定されているため、`[name]`にはオブジェクトの各プロパティ名が代入される。
- `output.path`は出力先のパスを設定する。上記の通り`public/packs`が設定されている。
- `output.publicPath`は本番ビルド時のCSSやHTML内のURLを設定する。これは本番のみCDNを使う場合に便利。上述の通りこれは`/packs`が設定されているが、`ASSET_HOST`という環境変数でこれを変更することができるようになっている。

```
module.exports = {
  module: {
    rules: sync(join(loadersDir, '*.js')).map(loader => require(loader))
  }
}
```

- `rules`はwebpackのモジュールを設定する。
- `config/webpack/loaders/*.js`にマッチするファイルを検索している。
- マッチしたファイルを`require`している。各ファイルは以下のようになっている。これによって、`config/webpack/loaders/*.js`内の設定を展開している。

```
module.exports = {
  test: /\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2)$/i,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath,
      name: env.NODE_ENV === 'production' ? '[name]-[hash].[ext]' : '[name].[ext]'
    }
  }]
}
```

```
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new ExtractTextPlugin(env.NODE_ENV === 'production' ? '[name]-[hash].css' : '[name].css'),
    new ManifestPlugin({
      publicPath: output.publicPath,
      writeToFileEmit: true
    })
  ]
}
```

- `plugins`はwebpackのプラグインを設定する。
- `webpack.EnvironmentPlugin`は`process.env`から環境変数にアクセスできるようにするプラグイン。
- `ExtractTextPlugin`はコンパイルされたテキストを別ファイルに出力するプラグイン。コンパイルしたCSSをJavaScriptでロードする他にLinkタグからロードしたい場合、コンパイルしたCSSをCSSファイルとして出力するためにこのプラグインを使う。
  - `[name]-[hash].css`の`[hash]`はビルド毎のユニークなハッシュ値を表す。
- `ManifestPlugin`はマニフェストファイルを生成するプラグイン。マニフェストファイルには、ファイル名と対応するコンパイル後のファイル名が載っている。マニフェストファイルによって、コンパイル前のファイル名からコンパイル後のファイル名に名前解決し、ヘルパーからアクセスできる。

```
= stylesheet_pack_tag "application" # load /packs/application-xxxxxxxx.css
```

```
{
  "application.css": "/packs/application-xxxxxxxx.css"
}
```

```
module.exports = {
  resolve: {
    extensions: settings.extensions,
    modules: [
      resolve(settings.source_path),
      'node_modules'
    ]
  }
}
```

- `resolve`はモジュール解決方法を設定する。webpackはデフォルトではいい感じに設定されている。
- `resolve.extensions`はファイル名からモジュールを解決する際に自動的に付与する拡張子を設定する。
- `resolve.modules`はモジュールを解決する際に検索されるディレクトリを設定する。

### `github.com/rails/webpacker/lib/webpacker/helper.rb`

`#stylesheet_pack_tag`がマニフェストファイルからどのようにアセットを参照するかを確認する。

```
def stylesheet_pack_tag(*names, **options)
  unless Webpacker.dev_server.running? && Webpacker.dev_server.hot_module_replacing?
    stylesheet_link_tag(*sources_from_pack_manifest(names, type: :stylesheet), **options)
  end
end

def sources_from_pack_manifest(names, type:)
  names.map { |name| Webpacker.manifest.lookup(pack_name_with_extension(name, type: type)) }
end

def pack_name_with_extension(name, type:)
  "#{name}#{compute_asset_extname(name, type: type)}"
end
```

- `#sources_from_pack_manifest`でマニフェストからアセットのファイル名を解決しているようだ。
- `ActionView::Helpers::AssetUrlHelper#compute_asset_extname`はファイル名と`type`から適切な拡張子を返す。
- `Webpacker.manifest`は`Webpacker::Manifest`インスタンスを返す。

### `github.com/rails/webpacker/lib/webpacker/manifest.rb`

```
def lookup(name)
  compile if compiling?
  find name
end

def find(name)
  data[name.to_s] || handle_missing_entry(name)
end

def data
  if env.development?
    refresh
  else
    @data ||= load
  end
end

def refresh
  @data = load
end

def load
  if config.public_manifest_path.exist?
    JSON.parse config.public_manifest_path.read
  else
    {}
  end
end
```

- `#lookup`はマニフェストファイルの中身にアクセスしている。
- マニフェストファイルの中身は`JSON.parse`した結果をメモリに保持している。開発環境ではアクセス毎に`JSON.parse`し直している。
