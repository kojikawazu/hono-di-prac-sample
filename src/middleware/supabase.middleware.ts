import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase/database.types';
import { config } from 'dotenv';

// 環境変数を読み込む
config();

// SupabaseのURLと匿名キーを環境変数から取得
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Supabaseクライアントを作成
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
