# 中国語単語帳

シンプルな中国語単語帳 Web アプリです。

## 機能

- 単語の登録（漢字・ピンイン・日本語訳）
- 単語一覧表示
- 単語の削除
- ログイン/ログアウト（未ログインでも一覧は閲覧可能）

## 技術スタック

- フロントエンド: バニラ JavaScript + HTML/CSS
- バックエンド: Firebase（Firestore + Authentication）
- Firebase SDK: CDN 経由（ビルドツール不要）
- ホスティング: Firebase Hosting

## セットアップ

### 1. Firebase プロジェクトを作成する

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Firestore Database を有効化（ロケーション: `asia-northeast1` 推奨）
3. Authentication を有効化（メール/パスワード）
4. ウェブアプリを追加し、SDK の設定値を控える

### 2. ユーザーを作成する

Firebase Console の **Authentication → ユーザー → ユーザーを追加** からメールアドレスとパスワードを登録してください。

### 3. Firebase の設定を書き込む

`config/firebase.example.js` をコピーして `config/firebase.js` を作成し、Firebase の設定値を記入します。

```bash
cp config/firebase.example.js config/firebase.js
```

`config/firebase.js` を編集：

```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Firestore セキュリティルールを設定する

Firebase Console の **Firestore → ルール** に以下を設定してください：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. ローカルで起動する

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開く。

## デプロイ

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy --only hosting
```

## ライセンス

MIT
