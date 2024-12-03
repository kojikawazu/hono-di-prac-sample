// リフレクションのインポート
import 'reflect-metadata';
// 環境変数のインポート
import { config } from 'dotenv';
// 環境変数を最初に読み込む
config();
// DIコンテナの登録
import './di/container';
// ルーティングのインポート
import { createRouter } from './routes/routes';
// サーバーのインポート
import { serve } from '@hono/node-server';

// ルーターの作成
const app = createRouter();
// ポートの設定
const port = process.env.PORT || 3000;

// NODE_ENV が 'test' でない場合のみサーバーを起動
if (process.env.NODE_ENV !== 'test') {
    serve({
        fetch: app.fetch,
        port: Number(port),
    });
}

export default app;
