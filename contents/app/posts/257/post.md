---
title: ghqを読んだ
time: 2015-03-29 01:58
tags: ['go']
---

Goの勉強のため、普段からお世話になっている[motemen/ghq](https://github.com/motemen/ghq)を読むことにした。なお、現在の僕のGoの知識はgotourを完走した程度だ。最初から現在のコミットを追いかけるのは骨が折れそうだったので、最初のコミット[`bad21c7df65ccefd74530d6fcc5f0707b63e0266`](https://github.com/motemen/ghq/commit/bad21c7df65ccefd74530d6fcc5f0707b63e0266)から読むことにした。

Goのプログラムは`main`パッケージの`main()`から実行されるため、`main.go`の`main()`から読む。

```
import {
    // ...

    "github.com/codegangsta/cli"
}

func main() {
    app := cli.NewApp()
    app.Name = "ghq"
    app.Usage = "Manage GitHub repository clones"
    app.Version = "0.1.0"
    app.Author = "motemen"
    app.Email = "motemen@gmail.com"
    app.Commands = []cli.Command{
        {
            Name: "get",
            Usage: "Clone/sync with a remote repository",
            Action: CommandGet,
        },
        {
            Name: "list",
            Usage: "List local repositories",
            Action: CommandList,
            Flags: []cli.Flag{
                cli.BoolFlag{"exact, e", "Exact match"}
            }
        }
    }

    app.Run(os.Args)
}
```

- `cli`パッケージは[codegangsta/cli](https://github.com/codegangsta/cli)というコマンドを簡単に作成するライブラリのもののようだ。
- `cli.NewApp()`は`*cli.App`（構造体`App`のポインタ）を返している。この構造体はCLIアプリケーションを表している。これに続くコードはそのCLIアプリケーションの情報を設定している。
- `app.Commands`というフィールドには`cli.Command`型のスライスが入る。`cli.Command`型はCLIアプリケーションのサブコマンドを定義するために使われる。サブコマンドの名前、ドキュメント、フラグなどを設定し実際に実行される関数を指定することができる。実行される関数は`Action`というフィールドに指定する。このフィールドは`func(context *Context)`という型になっている。ここでは、`get`と`list`というサブコマンドが定義されており、それぞれ`CommandGet`, `CommandList`という関数が実行されるように設定されている。
- 最後に`app.Run()`でコマンドライン引数を受け取ってCLIアプリケーションを実行している。

とりあえず`get`サブコマンドを理解したいので、`CommandGet`を見ていく。

```
func CommandGet(c *cli.Context) {
    argUrl := c.Args().Get(0)

    if argUrl == "" {
        cli.ShowCommandHelp(c, "get")
        os.Exit(1)
    }

    // ...
}
```

- 上述の通り、`Command.Action`は`func(context *Context)`という型なので、`CommandGet`関数もそれに従っている。
- `cli.Context.Args()`は`cli.Args`型を返すが、これは`type Args []string`と定義されており、実体は`string`のスライスだ。`Args.Get(n int)`は`n`がスライスのサイズより大きかった場合に空文字を返すようになっている。
- `ShowCommandHelp`は`Context`ポインタとサブコマンドを表す文字列を渡すことで、そのサブコマンドのヘルプメッセージを出力する。
- 第1引数をURLとして取得し、それが空であればヘルプメッセージを表示するようになっている。

```
func CommandGet(c *cli.Context) {
    // ...

    u, err := ParseGithubURL(argUrl)
    if err != nil {
        log.Fatalf("While parsing URL: %s", err)
    }

    path := pathForRepository(u)
    if err != nil {
        log.Fatalf("Could not obtain path for repository %s: %s", u, err)
    }

    // ...
}
```

- `ParseGithubURL()`と`pathForRepository()`いう関数についてはあとで見ていくことにする。
- エラーがあった場合、`log.Fatalf`関数でエラーメッセージを表示するものと思われる。`log`パッケージはGoの標準パッケージで、`log.Fatalf`関数はエラーメッセージを表示するだけでなく`exit(1)`によってプログラムを異常終了させる。

```
func CommandGet(c *cli.Context) {
    // ...

    newPath := false

    _, err := os.Stat(path)
    if err != nil {
        if os.IsNotExist(err) {
            newPath = true
            err = nil
        }
        mustBeOkay(err)
    }

    // ...
}
```

- `os.Stat`関数はファイルの存在をチェックする際によく用いられるようだ。この関数は指定したパスにあるファイルの情報を表す`FileInfo`構造体と、エラー時にはエラーを返す。
- `os.IsNotExist()`関数も存在チェックを行うように見える。ファイルの存在をチェックするGoの実装は諸説あるようだ。
- `mustBeOkay()`関数は定義を見てみると、引数の渡したエラーが存在すればエラーメッセージを表示して異常終了させるようだ。アサーションのような役割を果たしているようだ。
- ファイルパスが存在しない場合は`newPath`が`true`になる。また、`err`が`nil`になるため、`mustBeOkay()`で異常終了は起きなくなる。

```
func CommandGet(c *cli.Context) {
    // ...

    if newPath {
        dir, _ := filepath.Split(path)
        mustBeOkay(os.MkdirAll(dir, 0755))
        Git("clone", u.String(), path)
    } else {
        mustBeOkay(os.Chdir(path))
        Git("remote", "update")
    }
}
```

- `filepath.Split()`は与えられたパスをディレクトリとファイル名に分け、ディレクトリ、ファイル名の順に返す。
- `Git()`関数はあとで詳しく見る。
- `newPath`が`true`になるのは上述の通り`path`が存在しない場合で、このときは`git clone`が行われ、そうでなければ`git remote update`が行われるようだ。

`ghq get`コマンドの全体像についておおまかに理解できたので、飛ばした関数について1つずつ読んでいく。

```
type GitHubURL struct {
    *url.URL
    User string
    Repo string
}

func ParseGitHubURL(urlString string) (*GitHubURL, error) {
    u, err := url.Parse(urlString)
    if err != nil {
        return nil, err
    }

    if !u.IsAbs() {
        u.Scheme = "https"
        u.Host = "github.com"
        if u.Path[0] != '/' {
            u.Path = '/' + u.Path
        }
    }

    if u.Host != "github.com" {
        return nil, fmt.Errorf("URL is not of github.com: %s", u)
    }

    components := strings.Split(u.Path, "/")
    if len(components) < 3 {
        return nil, fmt.Errorf("URL does not contain user and repo: %s %v", u, components)
    }
    user, repo := components[1], components[2]

    return &GitHubURL{u, user, repo}, nil
}
```

- `url.Parse()`は与えられた文字列をパースして`URL`構造体のポインタと失敗した場合は`error`を返す。
- `URL`構造体は`Scheme`や`Host`といったフィールドを持っているため、相対パスであればこれらを設定している。
- `fmt.Errorf()`はフォーマット化された文字列からエラー値を返す。
- `strings.Split()`は文字列を第2引数で渡されたセパレータで分解し`string`のスライスとして返す。

続いて`pathForRepository()`関数を読んでいく。

```
func reposRoot() string {
    reposRoot, err := GitConfig("ghq.root")
    mustBeOkay(err)

    if reposRoot == "" {
        usr, err := user.Current()
        mustBeOkay(err)

        reposRoot = path.Join(usr.HomeDir, ".ghq", "repos")
    }

    return reposRoot
}

func pathForRepository(u *GitHubURL) string {
    return path.Join(reposRoot(), "@"+u.User, u.Repo)
}
```

- `path.Join`はパスの要素を`/`で結合してパスにする。
- `GitConfig()`は後ほど読んでいく。おそらくリポジトリのルートパスを返すものと思われる。
- `reposRoot`が空であれば`$HOME/.ghq/repos`を返すようになっている。`user.Current()`はカレントユーザーを表す`User`構造体のポインタを返す。`User`構造体はユーザー名やホームディレクトリなどの情報を持っている。`usr.HomeDir`でホームディレクトリを取得している。

続いて`Git()`関数を読んでいく。

```
func Git(command ...string) {
    log.Printf("Running 'git %s'\n", strings.Join(command, " "))
    cmd := exec.Command("git", command...)
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    err := cmd.Run()
    if err != nil {
        log.Fatalf("git %s: %s", strings.Join(command, " "), err)
    }
}
```

- `...string`のように引数の型名の前に`...`をつけると可変長引数をとることができる。この引数の型は型名で指定した型のスライスとなる。つまりここでは`string`のスライスとなる。
- `fmt.Printf()`関数は標準出力に出力するものだが、`log.Printf`はロガーで指定された出力先に出力する点が異なる。
- `exec.Command()`関数は、第1引数で指定された名前のコマンドを渡された可変長引数で実行するコマンドを表す`Cmd`構造体のポインタを返す。
- `...`で渡された可変長引数は上述の通りスライスなのだけど、スライスを展開して可変長引数として関数に渡す場合は`command...`のようにスライスのあとに`...`とつける。
- `cmd.Run`で指定されたコマンドを実行する。

続いて`GitConfig()`関数を読んでいく。

```
func GitConfig(key string) (string, error) {
    defaultValue := ""

    cmd := exec.Command("git", "config", "--path", "--null", "--get", key)
    cmd.Stderr = os.Stderr

    buf, err := cmd.Output()

    if exitError, ok := err.(*exec.ExitError); ok {
        if waitStatus, ok := exitError.Sys().(syscall.WaitStatus); ok {
            if waitStatus.ExitStatus() == 1 {
                return defaultValue, nil
            } else {
                return "", err
            }
        } else {
            return "", err
        }
    }

    return strings.TrimRight(string(buf), "\000"), nil
}
```

- `cmd.Output()`関数はコマンドを実行して標準出力を返す。
- `err.(*exec.ExitError)`というのは型アサーションという文法だそうだ。`err`は`error`インターフェイス型で、これが`*exec.ExitError`型の値であると断定する。変換された値が第1返り値、変換に成功したかどうかが第2返り値になる。
- ここらへんでやっていることは終了ステータスを取得しようとしている。
- `strings.TrimRight()`関数は第2引数を削除した`string`スライスを返す。
