---
title: 型消去を用いたSwiftによるリポジトリパターンの実装
time: 2016-03-11 16:00
tags: ['swift']
---

# リポジトリパターンとは

> リポジトリはオブジェクトの参照を取得するのに必要なロジックをすべてカプセル化するためのパターンです。
> 
> _Domain Driven Design Quickly 日本語訳_

iOSアプリ開発の文脈では、オブジェクトをWeb APIから取得するのかRealmから取得するのかといった関心ごとがある。リポジトリを実装することで次のようなメリットがあると思う。

- どこからどのように取得するのかなどの関心ごとからドメインモデルを切り離せるため、ドメインモデルをクリアに保つことができる。（DDDの観点）
- テスト時にWeb APIやRealmにアクセスするリポジトリをメモリにアクセスするリポジトリに差し替えること（Dependency Injection）が可能になるため、テストデータを簡単に用意できたりテストのパフォーマンスを向上できるなど、テストしやすくなる。（テスタビリティの観点）

# 型消去とは

先日行われた[try! Swift](http://www.tryswiftconf.com/)で紹介されたテクニックで、トークの内容については以下の書き起こし記事が詳しいと思う。

<iframe src="http://niwatako.hatenablog.jp/embed/2016/03/02/125706" title="try! Swift 書き起こし 平常心で型を消し去る #tryswiftconf Day1-5 - niwatakoのはてなブログ" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 190px; max-width: 500px; margin: 10px 0px;"></iframe>

型消去とは何か、端的に説明するのはかなり難しい。ただ、リポジトリパターンをSwiftで実装するにあたって非常に強力なテクニックであることが分かったので、型消去を用いない場合と用いた場合とを比べて型消去について説明してみたいと思う。

## 型消去を用いない場合

例のごとく`Pokemon`オブジェクトを取得するリポジトリを考える。`Pokemon`はWeb APIから取得するかもしれないし、Realmから取得するかもしれない。とりあえず以下のようなprotocolを定義して、`Pokemon`を取得するインターフェイスを用意する。

```
protocol PokemonRepository {
    func find(ID: UInt) -> Pokemon?
    func findAll() -> [Pokemon]
}
```

そして、実際にRealmから`Pokemon`を取得するリポジトリはこのprotocolを実装して以下のように書けると思う。

```
struct RealmPokemonRepository: PokemonRepository {
    func find(ID: UInt) -> Pokemon? {
        let realm = try! Realm()
        return realm.objects(Pokemon).filter("ID == %d", ID).first
    }

    func findAll() -> [Pokemon] {
        let realm = try! Realm()
        return realm.objects(Pokemon)
    }
}
```

同様にメモリ内の`[Pokemon]`から`Pokemon`を取得するリポジトリは以下のように書けると思う。

```
struct MemoryPokemonRepository: PokemonRepository {
    let pokemons = [
        Pokemon(ID: 1, name: "フシギダネ"),
        Pokemon(ID: 2, name: "フシギソウ"),
        Pokemon(ID: 3, name: "フシギバナ")
    ]

    func find(ID: UInt) -> Pokemon? {
        return pokemons.filter { $0.ID == ID }.first
    }

    func findAll() -> [Pokemon] {
        return pokemons
    }
}
```

ViewController等でこのリポジトリを使う場合は以下のように書けると思う。

```
class PokedexViewController: UITableViewController {
    var pokedex: [Pokemon] = []
    lazy var repository: PokemonRepository = RealmPokemonRepository()

    override func viewDidLoad() {
        super.viewDidLoad()

        pokedex = repository.findAll()
    }
}
```

テストを書く際は以下のようにリポジトリを差し替えることでRealmへのアクセスを回避できる。

```
class PokedexViewControllerTests: XCTestCase {
    var viewController: PokedexViewController!

    override func setUp() {
        viewController = PokedexViewController()
        viewController.repository = MemoryPokemonRepository()
    }
}
```

こうして`Pokemon`を取得するリポジトリを実装することで、どのようにオブジェクトを取得するのかという関心ごとをカプセル化し、テスタビリティのある設計が可能になった。しかし、この実装には大きな問題がある。

**型消去を用いない実装の問題点は、ドメインモデルごとに似たようなprotocolを用意しなくてはならないことだ** 。例えば、今度は`Human`を取得したいという場合に同様に`HumanRepository`を定義しなくてはならないし、その次に`Town`を取得したいという場合には`TownRepository`を定義しなくてはならない。これらのprotocolはほとんど中身が同じボイラープレートになってしまうだろう。

それでは、より汎用的な`Repository`というprotocolを以下のように定義してみてはどうだろうかと考えてみる。

```
protocol Repository {
    typealias Domain

    func find(ID: UInt) -> Domain?
    func findAll() -> [Domain]
}
```

typealiasを使ってGenericsなprotocolを定義することでより汎用的になった。そして、これを実装するリポジトリは例えばこんな感じになる。

```
struct RealmPokemonRepository: Repository {
    typealias Domain = Pokemon

    func find(ID: UInt) -> Pokemon? {
        let realm = try! Realm()
        return realm.objects(Pokemon).filter("ID == %d", ID).first
    }

    func findAll() -> [Pokemon] {
        let realm = try! Realm()
        return realm.objects(Pokemon)
    }
}
```

しかし、これはすぐにうまくいかないことがわかる。

```
lazy var repository: Repository = RealmPokemonRepository
```

のようなコードはコンパイルエラーになってしまうのだ。`Repository`のようなtypealiasをもつprotocolはtypealiasに具体的な型をもっていないため抽象型と呼ばれ、そのまま変数の型として宣言することができない。

このままおとなしくドメインモデルごとにボイラープレートのようなprotocolを書かなくてはいけないんだろうか（←try! Swift参加前の筆者）。

## 型消去を用いた場合

あらゆるリポジトリを汎用的に扱えるようにするため、以下のような`AnyRepository`を定義する。

```
struct AnyRepository: Repository {
    typealias Domain = DomainType

    private let _find: UInt -> DomainType?
    private let _findAll: () -> [DomainType]

    init(_ repository: T) {
        _find = repository.find
        _findAll = repository.findAll
    }

    func find(ID: UInt) -> DomainType? {
        return _find(ID)
    }

    func findAll() -> [DomainType] {
        return _findAll()
    }
}
```

`AnyRepository<Pokemon>`として使う場合は、`typealias Domain = Pokemon`となっている`Repository`を実装した型のみ`AnyRepository()`に渡すことができる。例えば、ViewControllerではこんな感じで使うことになる。

```
class PokedexViewController: UITableViewController {
    var pokedex: [Pokemon] = []
    lazy var repository: AnyRepository = AnyRepository(RealmPokemonRepository())

    override func viewDidLoad() {
        super.viewDidLoad()

        pokedex = repository.findAll()
    }
}
```

同様にテストではこんな感じになると思う。

```
class PokedexViewControllerTests: XCTestCase {
    var viewController: PokedexViewController!

    override func setUp() {
        viewController = PokedexViewController()
        viewController.repository = AnyRepository(MemoryPokemonRepository())
    }
}
```

`AnyRepository`があることで、`PokemonRepository`や`HumanRepository`のようなドメインモデルごとのprotocolは不要になり、それぞれ`AnyRepository<Pokemon>`、`AnyRepository<Human>`のような型を使うことで対処できる。これでボイラープレートのようなコードを書く必要はなくなった。

**型消去とは、この例で言うと`PokemonRepository`型であった`repository`が`AnyRepository<Pokemon>`という型にしてしまうことを指しているようだ** 。型消去というのは、より柔軟な設計のための結果として考えることができそう。

* * *

以降は型消去とは無関係だけど、リポジトリパターンを実装するにあたって必要となった技術要素を紹介していきたいと思う。

# クエリのインターフェイス

上で紹介した`Repository`は意図的に不十分なインターフェイスだった。というのは、`findAll()`というメソッドはその名の通りすべてのオブジェクトを取得してしまうので、現実的には検索条件やソートなどのパラメータを指定できる必要があると思う。

ここで指定される検索条件は内部的にGETリクエストのパラメータやRealmに渡される`NSPredicate`に変換されることになる。また、検索条件といっても単純に一致するためのものだけでなく、不一致や含んでいるかといった検索方法もある。Web APIに問い合わせるのかRealmに問い合わせるのかといったバックエンドに関わらず、これらを統一的に表すクエリの表現が必要となると思った。

そこでAnyQueryという小さなライブラリを開発した。

[naoty/AnyQuery](https://github.com/naoty/AnyQuery)

これを使って`Repository`はこんな感じに定義できる。

```
protocol Repository {
    typealias Domain

    func find(ID: UInt) -> Domain?
    func findAll(query query: AnyQuery?, sort: AnySort?) -> [Domain]
}

extension Repository {
    func findAll() -> Domain? {
        return findAll(query: nil, sort: nil)
    }
}
```

`RealmPokemonRepository`で実際に使う場合はこんな感じになる。

```
struct RealmPokemonRepository: Repository {
    typealias Domain = Pokemon

    func find(ID: UInt) -> Pokemon? {
        let realm = try! Realm()
        return realm.objects(Pokemon).filter("ID == %d", ID).first
    }

    func findAll(query query: AnyQuery?, sort: AnySort?) -> [Pokemon] {
        let realm = try! Realm()
        var result realm.objects(Pokemon)

        if let predicate = query?.predicate {
            result = result.filter(predicate)
        }

        if let sortDescriptors = sort?.sortDescriptors {
            for sortDescriptor in sortDescriptors {
                guard let key = sortDescriptor.key else {
                    continue
                }
                result = result.sorted(key, ascending: sortDescriptor.ascending)
            }
        }

        return result
    }
}
```

そして、ViewControllerからはこんな感じでクエリを組み立てることができる。

```
class PokedexViewController: UITableViewController {
    var pokedex: [Pokemon] = []
    lazy var repository: PokemonRepository = RealmPokemonRepository()

    override func viewDidLoad() {
        super.viewDidLoad()

        let query = AnyQuery.In(key: "ID", values: [1, 2, 3, 4, 5])
        let sort = AnySort.Ascending(key: "name")
        pokedex = repository.findAll(query: query, sort: sort)
    }
}
```

詳細は[README](https://github.com/naoty/AnyQuery/blob/master/README.md)に書いてあるが、例えば、こんな風に複雑な条件も表現できる。

```
let query = AnyQuery.Between(key: "ID", lhs: 1, rhs: 100) && AnyQuery.NotEqual(key: "type", PokemonType.Fire.rawValue)
let sort = AnySort.Descending(key: "weight") > AnySort.Descending(key: "height")
```

# 非同期処理の取り扱い

たいていの取得処理は非同期に行われるため、リポジトリのインターフェイスも非同期処理を前提にしなくてはならないと思う。しかし、取得完了時の処理をクロージャとして渡すインターフェイスはコールバック・ヘルにつながるため、Promiseライクなライブラリを使ってオブジェクトの代わりにPromiseオブジェクトを返すような形がいいと思った。

例として[SwiftTask](https://github.com/ReactKit/SwiftTask)を使って以下のように`Repository`を定義してみた。

```
protocol Repository {
    typealias Domain
    
    func find(ID: UInt) -> Task
    func findAll(query query: AnyQuery?, sort: AnySort?) -> Task
}
```

そして、実装は以下のようになる。

```
class RealmPokemonRepository: Repository {
    typealias Domain = Pokemon

    func find(ID: UInt) -> Task {
        return Task<Float, Pokemon, ErrorType> { fulfill, reject in
            let realm = try! Realm()
            if let pokemon = realm.objects(Pokemon).filter("ID == %d", ID).first {
                fulfill(pokemon.pokemon)
            } else {
                reject(RepositoryError.NotFound)
            }
        }
    }

    func findAll(query query: AnyQuery?, sort: AnySort?) -> Task {
        return Task<Float, [Pokemon], ErrorType> { fulfill, reject in
            let realm = try! Realm()
            var result = realm.objects(RealmPokemon)
            
            if let predicate = query?.predicate {
                result = result.filter(predicate)
            }
            
            if let sortDescriptors = sort?.sortDescriptors {
                for sortDescriptor in sortDescriptors {
                    guard let key = sortDescriptor.key else {
                        continue
                    }
                    result = result.sorted(key, ascending: sortDescriptor.ascending)
                }
            }
            
            if result.isEmpty {
                reject(RepositoryError.NotFound)
            } else {
                let pokemons = result.map { $0.pokemon }
                fulfill(pokemons)
            }
        }
    }
}
```

# 最後に

Swiftでリポジトリパターンを実装するにあたってのポイントは3つあった。

- 型消去によってリポジトリのための汎用的なインターフェイスを定義する。
- [AnyQuery](https://github.com/naoty/AnyQuery)を使ってクエリのインターフェイスを統一する。
- Promiseライクなライブラリを使って非同期処理も考慮したリポジトリを設計する。

以上で説明したことはすべてこちらのサンプルプロジェクトで詳細を見ることができるので、参考にしてほしい。

[naoty/Playground](https://github.com/naoty/Playground/tree/master/Repository)
