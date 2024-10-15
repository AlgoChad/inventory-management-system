import NodeCache from 'node-cache';
import { ICacheManager } from './ICacheManager';

export class CacheManager implements ICacheManager {
    private Cache: NodeCache;
    private RefreshIntervals: { [key: string]: NodeJS.Timeout | NodeJS.Timer } = {};
    private RefreshCounters: { [key: string]: number } = {};

    constructor(ttlSeconds: number) {
        this.Cache = new NodeCache({ stdTTL: ttlSeconds });
    }

    public GetOrCreate(
        Key: string, 
        Create: () => any
    ): any {
        let Value = this.Get(Key);

        if (Value === undefined || Value === null) {
            Value = Create();
            this.Set(Key, Value);
        }

        return Value;
    }

    public async GetOrCreateAsync(
        Key: string, 
        Create: () => Promise<any>
    ): Promise<any> {
        let Value = this.Get(Key);

        if (Value === undefined || Value === null) {
            Value = await Create();
            this.Set(Key, Value);
        }

        return Value;
    }

    public Get(Key: string): any {
        return this.Cache.get(Key);
    }

    public Set(Key: string, Value: any): void {
        this.Cache.set(Key, Value);
    }

    public async SetAsync(Key: string, Value: any): Promise<void> {
        this.Cache.set(Key, Value);
    }

    public Delete(Key: string): void {
        this.Cache.del(Key);
        this.ClearRefreshInterval(Key);
    }

    public async DeleteAsync(Key: string): Promise<void> {
        this.Cache.del(Key);
        this.ClearRefreshInterval(Key);
    }

    public RefreshAhead(
        key: string, 
        create: () => any, 
        intervalSeconds: number
    ): void {
        this.ClearRefreshInterval(key);

        this.RefreshIntervals[key] = setInterval(() => {
            const Value = create();
            this.Set(key, Value);

            if (!this.RefreshCounters[key]) {
                this.RefreshCounters[key] = 0;
            }
            
            this.RefreshCounters[key]++;
        
            if (this.RefreshCounters[key] >= 3) {
                clearInterval(this.RefreshIntervals[key]);
                delete this.RefreshIntervals[key];
                delete this.RefreshCounters[key];
            }
        }, intervalSeconds * 1000);
    }

    private ClearRefreshInterval(Key: string): void {
        if (this.RefreshIntervals[Key]) {
            clearInterval(this.RefreshIntervals[Key]);
            delete this.RefreshIntervals[Key];
        }
    }
}