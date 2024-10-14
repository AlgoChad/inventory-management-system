export interface ICacheManager {
    GetOrCreate(key: string, create: () => any): any;
    GetOrCreateAsync(key: string, create: () => Promise<any>): Promise<any>;
    Get(key: string): any;
    Set(key: string, value: any): void;
    SetAsync(key: string, value: any): Promise<void>;
    Delete(key: string): void;
    DeleteAsync(key: string): Promise<void>;
    RefreshAhead(Key: string, create: () => any, IntervalSeconds: number): void;
}
