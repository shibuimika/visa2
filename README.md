# VISAオンライン申請サービス

在日外国人が「在留資格（技人国・特定技能・留学・家族滞在）」に関する申請を、**完全オンラインで簡便かつ安心して行えるWebサービス**です。

## 特徴

- **数問アンケート→自分専用フロー生成**: 4問のアンケートで自動的に申請フローを分岐
- **準備物が明確**: システム環境と書類の準備物チェックリスト
- **必要な入力のみ表示**: 迷わずに必要書類と入力項目を揃えられる
- **即時バリデーション**: リアルタイムでの入力チェック
- **PDFとオンライン提出**: 申請完了まで一気通貫

## 対応在留資格

- 技術・人文知識・国際業務（技人国）
- 特定技能1号
- 特定技能2号
- 留学
- 家族滞在

## 対応手続き

- 更新
- 変更
- 取得

## 技術スタック

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Management**: React Hook Form + Zod
- **Routing**: React Router v6
- **Internationalization**: react-i18next

## 開発環境セットアップ

### 必要条件

- Node.js 18以上
- npm

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

### 利用可能なスクリプト

- `npm start`: 開発サーバーを起動（http://localhost:3000）
- `npm run build`: 本番用ビルドを作成
- `npm test`: テストを実行

## デプロイ

このプロジェクトはNetlifyでのデプロイに対応しています。

### Netlify設定

- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Node version**: 18

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── auth/           # 認証関連
│   ├── common/         # 共通コンポーネント
│   ├── confirmation/   # 確認画面
│   ├── completion/     # 完了画面
│   ├── forms/          # フォーム関連
│   │   ├── conditional/ # 条件付きフォーム
│   │   └── ...
│   ├── survey/         # アンケート
│   └── checklist/      # 準備物チェック
├── pages/              # ページコンポーネント
├── stores/             # Zustandストア
├── types/              # TypeScript型定義
├── utils/              # ユーティリティ関数
├── constants/          # 定数
└── locales/            # 多言語対応
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
