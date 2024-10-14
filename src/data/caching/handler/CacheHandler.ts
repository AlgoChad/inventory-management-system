import { ICacheManager } from "../manager/ICacheManager";
import { ICacheHandler } from "./ICacheHandler";

export class CacheHandler implements ICacheHandler {
    private Cache: ICacheManager;
    private CacheKeyPrefix: string;
    private CacheKeys: Set<string> = new Set<string>();
    private LambdaStore: { [key: string]: () => any } = {};
    private CacheOrder: Map<string, number> = new Map<string, number>();
    private static readonly MAX_CACHE_ITEMS = 50;
    private static readonly CACHE_CLEAR_INTERVAL_MS = 60 * 60 * 1000;

    constructor(cacheManager: ICacheManager, cacheKeyPrefix: string) {
        this.Cache = cacheManager;
        this.CacheKeyPrefix = cacheKeyPrefix;
        this.startCacheClearTimer();
    }

    private startCacheClearTimer(): void {
        setInterval(() => {
            this.InvalidateCache();
        }, CacheHandler.CACHE_CLEAR_INTERVAL_MS);
    }

    public GetCacheKey(method: string, funcString?: string, ...params: any[]): string {
        const serializedParams = JSON.stringify(params);
        return `${this.CacheKeyPrefix}:${method}:${funcString ?? ''}:${serializedParams}`;
    }

    public AddCacheKey(key: string): void {
        this.CacheKeys.add(key);
        this.CacheOrder.set(key, Date.now());
        this.EnforceCacheLimit();
    }

    private EnforceCacheLimit(): void {
        while (this.CacheOrder.size > CacheHandler.MAX_CACHE_ITEMS) {
            const oldestKey = Array.from(this.CacheOrder.keys()).reduce((a, b) => this.CacheOrder.get(a)! < this.CacheOrder.get(b)! ? a : b);
            this.Cache.Delete(oldestKey);
            this.CacheKeys.delete(oldestKey);
            this.CacheOrder.delete(oldestKey);
        }
    }

    public InvalidateCache(): void {
        this.CacheKeys.forEach(key => this.Cache.Delete(key));
        this.CacheKeys.clear();
        this.CacheOrder.clear();
    }

    public async GetOrAddAndRefreshAsync(
        key: string, 
        create: () => any
    ): Promise<any> {
        var cachedData = await this.Cache.GetOrCreateAsync(key, create);
        this.AddCacheKey(key);
        this.LambdaStore[key] = create;

        this.Cache.RefreshAhead(key, create, 600);

        return cachedData;
    }

    public GetOrAddAndRefresh(
        key: string, 
        create: () => any
    ): any {
        var cachedData = this.Cache.GetOrCreate(key, create);
        this.AddCacheKey(key);
        this.LambdaStore[key] = create;
        
        this.Cache.RefreshAhead(key, create, 600);

        return cachedData;
    }

    public async RefreshCacheAsync(): Promise<void> {
        const updatePromises = Array.from(this.CacheKeys)
            .filter(key => key.startsWith(this.CacheKeyPrefix))
            .map(async key => {
                if (this.LambdaStore[key]) {
                    try {
                        const value = await this.LambdaStore[key]();
                        await this.Cache.SetAsync(key, value);
                        this.AddCacheKey(key);
                    } catch (error) {
                        console.error(`Error updating cache for key ${key}:`, error);
                    }
                }
            });
        
        await Promise.allSettled(updatePromises);
    }
}