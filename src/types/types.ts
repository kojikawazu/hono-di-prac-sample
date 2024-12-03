// コンストラクター
export type Constructor<T> = new (...args: unknown[]) => T;

// コンテナ
export interface Container {
    register<T>(key: string | Constructor<T>, implementation: T): void;
    resolve<T>(key: string | Constructor<T>): T;
}
