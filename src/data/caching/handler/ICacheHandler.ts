export interface ICacheHandler {
    GetCacheKey(method: string, funcString?: string, ...params: any[]): string;
    AddCacheKey(key: string): void;
    InvalidateCache(): void;
    GetOrAddAndRefreshAsync(key: string, create: () => Promise<any>): Promise<any>;
    GetOrAddAndRefresh(key: string, create: () => any): any;
    RefreshCacheAsync(): Promise<void>;
}