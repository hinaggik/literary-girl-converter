# Literary Girl Converter

[English](#english) | [日本語](#日本語)

<a id="english"></a>
## English

### Overview
A Next.js + OpenAI API application that converts user-inputted text and emotions into poetic prose in the style of a quiet, literary girl's writing.

### Setup
1. Install required packages
    ```bash
    npm install
    ```
2. Set up your OpenAI API key in `.env.local`
    ```bash
    OPENAI_API_KEY=sk-...
    ```
3. Start the development server
    ```bash
    npm run dev
    ```

### Tech Stack
- Next.js
- TypeScript
- OpenAI API (gpt-3.5-turbo)

### Features
- Text input from users
- Conversion to "literary girl style" poetic text using GPT
- Toggle between horizontal and vertical writing modes (traditional Japanese style)
- Responsive design for all devices

### Note
- Always exclude `.env.local` from git to protect your API key.

---

<a id="日本語"></a>
## 日本語

### 概要
ユーザーが入力した言葉や感情を、静かで詩的な文学少女風の文章に変換して返すNext.js+OpenAI APIアプリです。

### セットアップ
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

### 技術構成
- Next.js
- TypeScript
- OpenAI API (gpt-3.5-turbo)

### 機能
- ユーザーがテキストを入力
- GPTが「静かな文学少女風」に変換して返答
- 横書き・縦書き切り替え機能
- レスポンシブデザイン対応

### 注意
- `.env.local`は必ずgit管理から除外してください。
