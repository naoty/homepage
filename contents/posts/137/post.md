---
title: Androidの標準カメラで撮った画像をPOSTで送信する
time: 2012-08-05 05:42
tags: ['android']
---

以下のような機能を実装したい。

- カメラを自作するのではなく、標準のカメラアプリで画像を撮影する。
- 撮影した画像はSDカードに保存する。
- 他の文字列などのデータとともに撮影した画像をPOSTでサーバーに送信する。
- サーバー側の負荷やパフォーマンスを考慮し、画像を縮小して送信する。

### 0. 前提

- ターゲット：2.2以上

### 1. SDカードが挿入されているか確認する

```
// PictureUtil.java

public static boolean isSdCardWritable {
    String state = Environment.getExternalStorageState();
    return state.equals(Environment.MEDIA_MOUNTED);
}
```

- SDカードに保存したいため、外部ストレージの状態を確認するメソッドをユーティリティクラスに定義する。
- 以下でも、画像に関わるメソッドをPictureUtilクラスに定義していく。

### 2. 標準カメラアプリを起動する

```
private static final int CAMERA_ACTIVITY_REQUEST_CODE = 100;
private Uri pictureUri;

public void onClick(View v) {
    if (!PictureUtil.isSdCardWritable()) {
        return; // (1)
    }

    ContentValues values = new ContentValues();
    values.put(MediaStore.Images.Media.TITLE, System.currentTimeMillis() + ".jpg");
    values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
    pictureUri = getContentResolver().insert(MediaStore.Images.Media.EXTRA_CONTENT_URI, values); // (2)

    Intent intent = new Intent();
    intent.setAction("android.media.action.IMAGE_CAPTURE");
    intent.putExtra(MediaStore.EXTRA_OUTPUT, pictureUri); // (3)
    startActivityForResult(intent, CAMERA_ACTIVITY_REQUEST_CODE);
}
```

- さきほど定義したメソッドを使ってSDカードが挿入されているか確認し、挿入されていなければ処理を中止する。実際のアプリでは、(1)に警告ダイアログを表示する処理を入れることになると思う。
- (2)：SDカード内の領域（MediaStore.Images.Media.EXTRA\_CONTENT\_URI）に画像データを挿入し、空の画像URIを取得する。
- (3)：そのURIをEXTRA\_OUTPUTにセットすることで、撮影した画像のURIをそのURIに書き込むことができる。

### 3. 撮った画像を取得する

```
private Bitmap picture;
private final int TARGET_WIDTH = 300;
private final int TARGET_HEIGHT = 300;

public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode != CAMERA_ACTIVITY_REQUEST_CODE || resultCode != RESULT_OK) {
        return;
    }

    if (pictureUri == null) {
        return; // (1)
    }

    try {
        InputStream is = getContentResolver().openInputStream(pictureUri);
        picture = BitmapFactory.decodeStream(is);
        picture = PictureUtil.resize(picture, TARGET_WIDTH, TARGET_HEIGHT); // (2)
        picture.recycle(); // (3)
    } catch (IOException e) {
        return;
    }
}
```

- (1)：特定の端末では、EXTRA\_OUTPUTに撮影した画像のURIが書き込まれないケースがある。その場合は、処理を中止する。実際のアプリでは、エラーダイアログを表示する処理を入れると思う。
- (2)：サーバー側の負荷やパフォーマンスを考慮し、撮影した画像を指定したサイズに縮小する。縮小する処理はユーティリティクラスに定義する。
- (3)：画像はメモリを大量に消費するため、OutOfMemoryエラーを起こしやすい。recycleメソッドを実行すると、メモリが不足した際に自動的に解放するようになる。

### 4. 画像を縮小する

```
// PictureUtil.java

private static Bitmap resize(Bitmap picture, int targetWidth, int targetHeight) {
    if (picture == null || height < 0 || width < 0) {
        return null;
    }

    int pictureWidth = picture.getWidth();
    int pictureHeight = picture.getHeight();
    float scale = Math.min((float) targetWidth / pictureWidth, (float) targetHeight / pictureHeight); // (1)

    Matrix matrix = new Matrix();
    matrix.postScale(scale, scale);
    
    return Bitmap.createBitmap(picture, 0, 0, pictureWidth, pictureHeight, matrix, true);
}
```

- (1)：縮小前の画像サイズと縮小したいサイズから縮小比率を計算する。

### 5. エンティティに画像データを追加してPOSTリクエストを送信する

```
public void onClick(View v) {
    if (picture.isRecycle()) { // (1)
        try {
            InputStream is = getContentResolver().openInputStream(pictureUri);
            picture = BitmapFactory.decodeStream(is);
            picture = PictureUtil.resize(picture, TARGET_WIDTH, TARGET_HEIGHT);
            picture.recycle();
        } catch (IOException e) {
            return;
        }
    }

    ByteArrayBody bab = PictureUtil.toByteArrayBody(picture); // (2)
    MultipartEntity requestEntity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
    requestEntity.addPart("picture", bab); // (3)
    requestEntity.addPart("string", new StringEntity("文字列"));
    // その他、送信したいデータを追加

    HttpClient client = new DefaultHttpClient();
    HttpPost request = new HttpPost("http://example.com");
    request.setEntity(requestEntity);

    // 以下、POSTリクエスト送信処理
}
```

- (1)：recycleメソッドを呼び出した画像を再利用する際、すでに画像がメモリから解放されている可能性がある。isRecycleメソッドによって解放されているか判定し、解放されていれば再度画像をURIから作成し縮小する。
- (2)：画像を送信する場合、ByteArrayBodyという型にする必要があるため、ユーティリティクラスに定義したメソッドを使って変換する。
- (3)：変換した画像データは、文字列データなどと同様にエンティティに追加できる。

```
// PictureUtil.java

private final int QUALITY = 100;

public static ByteArrayBody toByteArrayBody(Bitmap picture) {
    if (picture == null) {
        return null;
    }

    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    picture.compress(CompressFormat.JPEG, QUALITY, bos); // (4)
    byte[] data = bos.toByteArray();
    return new ByteArrayBody(data, System.currentTimeMillis() + ".jpg");
}
```

- (4)：画像データに変換する際、圧縮比率を0〜100の間で指定できる。0に近いほど高圧縮・低画質、100に近いほど低圧縮・高画質となる。
