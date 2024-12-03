# Hono の環境構築

## 1. ローカル環境の構築

### 1.1. ローカル環境の構築

```bash
mkdir hono-di-example
cd hono-di-example
npm init -y
```

```bash
npm install hono
npm install -D typescript @types/node tsx
npm install @hono/node-server
```

### 1.2. tsconfig.json の作成

以下コマンドを実行して、tsconfig.json を作成します。

```bash
npx tsc --init
```

### 1.3. ディレクトリ構造の作成

```bash
mkdir src
mkdir src/services
mkdir src/middleware
mkdir src/types
```

## 2. ESLint と Prettier の導入

```bash
# ESLintと関連パッケージをインストール
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# Prettierと関連パッケージをインストール
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
# eslint-define-configをインストール
npm install -D eslint-define-config
```

## 3. Supabase の導入

```bash
# supabase のインストール
npm i supabase@">=1.8.1" --save-dev
# supabase にログイン
npx supabase login
# supabase の初期化
npx supabase init
# 型定義ファイルの生成
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/types/supabase/database.types.ts
```

## 4. テスト導入

```bash
npm install -D vitest @vitest/coverage-v8 @supabase/supabase-js
```

## 5. その他モジュールの導入

```bash
npm install dotenv
npm install tsyringe
npm install reflect-metadata
```
