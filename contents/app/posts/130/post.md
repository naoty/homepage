---
title: binding.pryがあったらコミットを中止する
time: 2012-06-25 16:55
tags: ['rails']
---

ばいんでぃんぐぷらい便利ですね。

コミットすると、`binding.pry`がコミット予定のファイルに含まれていれば、コミットを中止すフックスクリプトを書きました。`.git/hooks/pre-commit`にコピペしてお使いください。ハードコーディングしちゃってるんで、適当に修正するといいですね。

gistにもあげてるので、forkなんかしてもらえるといいですね。
https://gist.github.com/2970881

```sh:.git/hooks/pre-commit
#!/usr/bin/env ruby

cached_files = `git diff --cached --name-only`
if cached_files.split($/).any? {|path| File.read(path).include?('binding.pry') }
  puts 'ERROR: binding.pry is found'
  exit 1
end
```

- `#!/usr/bin/env ruby`はrvmのrubyを使う場合のshebang
- `git diff --cached`でコミット予定のファイルの差分とってこれる
- `--name-only`でファイル名だけとってこれる
- `$/`は区切り文字
