# literary-girl-converter

ユーザーが入力した言葉や感情を、静かで詩的な文学少女風の文章に変換して返すNext.js+OpenAI APIアプリです。

## セットアップ
1. 必要なパッケージをインストール
    ```bash
    npm install
    ```
2. OpenAI APIキーを`.env.local`に設定
    ```bash
    OPENAI_API_KEY=sk-...
    ```
3. 開発サーバー起動
    ```bash
    npm run dev
    ```

## 技術構成
- Next.js
- OpenAI API (gpt-3.5-turbo)

## 機能
- ユーザーがテキストを入力
- GPTが「静かな文学少女風」に変換して返答

## 注意
- `.env.local`は必ずgit管理から除外してください。
