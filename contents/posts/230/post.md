---
title: Alamofire/**/*Tests.swiftを読んだ
time: 2014-08-15 17:01
tags: ['swift']
---

[前回](http://naoty.hatenablog.com/entry/2014/08/14/225112)Alamofireの実装を読んだので、ついでにテストコードも読んでみた。

```
$ tree -P "*Tests.swift" -I .git
.
├── Source
└── Tests
    ├── DownloadTests.swift
    ├── ParameterEncodingTests.swift
    ├── RequestTests.swift
    ├── ResponseTests.swift
    └── UploadTests.swift
```

とりあえず`RequestTests.swift`から読んでみる。

# RequestTests.swift

## L:26

```
extension Alamofire {
    struct RequestTests {
        class RequestInitializationTestCase: XCTestCase {
            // ...
        }

        class RequestResponseTestCase: XCTestCase {
            // ...
        }
    }
}
```

- このプロジェクトはビルドターゲットをもたないため、ターゲットごとに名前空間が作られるわけではない。そのため、`Alamofire`という構造体の中にテストクラスをネストさせることで実装コードを参照できるようにしている。
- テストケース、この場合は`init`とか`response`といったメソッドの単位でテストケースのクラスを作っているようだ。

## L:49

```
class RequestResponseTestCase: XCTestCase {
    func testRequestResponse() {
        let URL = "http://httpbin.org/get"
        let serializer = Alamofire.Request.stringResponseSerializer(encoding: NSUTF8StringEncoding)

        let expectation = expectationWithDescription("\(URL)")

        Alamofire.request(.GET, URL, parameters: ["foo": "bar"])
                 .response(serializer: serializer){ (request, response, string, error) in
                   expectation.fulfill()

                   XCTAssertNotNil(request, "request should not be nil")
                   XCTAssertNotNil(response, "response should not be nil")
                   XCTAssertNotNil(string, "string should not be nil")
                   XCTAssertNil(error, "error should be nil")
                 }

        waitForExpectationWithTimeout(10){ error in
            XCTAssertNil(error, "\(error)")
        }
    }
}
```

- `expectationWithDescription`と`waitForExpectationWithTimeout`はXcode 6からXCTestに追加された非同期テスト用のAPI。
- まず、`expectationWithDescription`メソッドで`XCTestExpectation`オブジェクトを生成する。
- `waitForExpectationWithTimeout`は指定された秒数、上で生成された`XCTestExpectation`オブジェクトの`fulfill`メソッドが呼ばれるのを待つ。呼ばれれば成功、呼ばれずに指定された秒数が経過すると失敗となり引数に渡されたクロージャを実行する。

* * *

他のテストコードも読んでみたけど、上と同じようなコードがあり特に読む必要はなさそうだった。
