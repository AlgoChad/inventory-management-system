import { PrismaClient } from '@prisma/client';
import EntityRepository from './EntityRepository';
import { ICacheManager } from '@/src/data/caching/manager/ICacheManager';
import IRepository from './IRepository';
import { PagedList } from '@/src/data/models/generic/PaginationModel';
import { ICacheHandler } from '@/src/data/caching/handler/ICacheHandler';
import { CacheHandler } from '@/src/data/caching/handler/CacheHandler';

export default class CachedRepository<T extends { id?: number | bigint | undefined }, CreateInput, UpdateInput> implements IRepository<T, CreateInput, UpdateInput> {
    private EntityRepository: EntityRepository<T, CreateInput, UpdateInput>;
    private CacheHandler: ICacheHandler;
    
    constructor(entityRepository: EntityRepository<T, CreateInput, UpdateInput>, cacheManager: ICacheManager, cacheKeyPrefix: string) {
        this.EntityRepository = entityRepository;
        this.CacheHandler = new CacheHandler(cacheManager, cacheKeyPrefix);
    }

    public GetEntity(
        func?: (query: PrismaClient) => T, 
        isCached?: boolean,
        queryParams?: any
    ): T | undefined {
        const cacheKey = this.CacheHandler.GetCacheKey('GetEntity', func?.toString(), func, queryParams);

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return this.CacheHandler.GetOrAddAndRefresh(cacheKey, 
                () => this.EntityRepository.GetEntity(func)
            );
        }

        return this.EntityRepository.GetEntity(func);
    }

    public async GetEntityAsync(
        func?: (query: PrismaClient) => Promise<T>, 
        isCached?: boolean,
        queryParams?: any
    ): Promise<T | undefined> {
        const cacheKey = this.CacheHandler.GetCacheKey('GetEntityAsync', func?.toString(), func, queryParams);

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return await this.CacheHandler.GetOrAddAndRefreshAsync(cacheKey, 
                async () => this.EntityRepository.GetEntityAsync(func)
            );
        }

        return this.EntityRepository.GetEntityAsync(func);
    }

    public GetById(
        id: number | bigint,
        isCached: boolean = true
    ): T | undefined {
        const cacheKey = this.CacheHandler.GetCacheKey('GetById', id.toString());

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return this.CacheHandler.GetOrAddAndRefresh(cacheKey,
                () => this.EntityRepository.GetById(id as number ?? id as bigint)
            );
        }

        return this.EntityRepository.GetById(id as number ?? id as bigint);
    }

    public async GetByIdAsync(
        id: number | bigint,
        isCached: boolean = true
    ): Promise<T | undefined> {
        const cacheKey = this.CacheHandler.GetCacheKey('GetByIdAsync', id.toString());

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return await this.CacheHandler.GetOrAddAndRefreshAsync(cacheKey,
                async () => this.EntityRepository.GetByIdAsync(id as number ?? id as bigint)
            );
        }

        return this.EntityRepository.GetByIdAsync(id as number ?? id as bigint);
    }

    public GetAll(
        func?: (query: PrismaClient) => T[],
        isCached?: boolean,
        queryParams?: any
    ): T[] {
        const cacheKey = this.CacheHandler.GetCacheKey('GetAll', func?.toString(), func, queryParams);

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return this.CacheHandler.GetOrAddAndRefresh(cacheKey,
                () => this.EntityRepository.GetAll(func)
            );
        }

        return this.EntityRepository.GetAll(func);
    }

    public async GetAllAsync(
        func?: ((query: PrismaClient) => Promise<T[]>) | undefined,
        isCached?: boolean,
        queryParams?: any
    ): Promise<T[]> {
        const cacheKey = this.CacheHandler.GetCacheKey('GetAllAsync', func?.toString(), func, queryParams);

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return await this.CacheHandler.GetOrAddAndRefreshAsync(cacheKey,
                async () => this.EntityRepository.GetAllAsync(func)
            );
        }

        return this.EntityRepository.GetAllAsync(func);
    }

    public GetAllPaged(
        func?: ((query: PrismaClient) => T[]) | undefined,
        pageIndex?: number,
        pageSize?: number,
        isCached?: boolean,
        queryParams?: any
    ): PagedList<T> {
        const cacheKey = this.CacheHandler.GetCacheKey(
            'GetAllPaged', 
            func?.toString(), 
            func, 
            pageIndex, 
            pageSize, 
            queryParams
        );

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return this.CacheHandler.GetOrAddAndRefresh(cacheKey,
                () => this.EntityRepository.GetAllPaged(func, pageIndex, pageSize)
            );
        }

        return this.EntityRepository.GetAllPaged(func, pageIndex, pageSize);
    }

    public async GetAllPagedAsync(
        func?: ((query: PrismaClient) => Promise<T[]>) | undefined,
        pageIndex?: number,
        pageSize?: number,
        isCached?: boolean,
        queryParams?: any
    ): Promise<PagedList<T>> {
        const cacheKey = this.CacheHandler.GetCacheKey(
            'GetAllPagedAsync', 
            func?.toString(), 
            func, 
            pageIndex, 
            pageSize, 
            queryParams
        );

        if (isCached) {
            this.CacheHandler.AddCacheKey(cacheKey);
            return await this.CacheHandler.GetOrAddAndRefreshAsync(cacheKey,
                async () => this.EntityRepository.GetAllPagedAsync(func, pageIndex, pageSize)
            );
        }

        return this.EntityRepository.GetAllPagedAsync(func, pageIndex, pageSize);
    }

    public Insert(entity: CreateInput): T;
    public Insert(entities: CreateInput[]): T[];

    public Insert(entityOrEntities: CreateInput | CreateInput[]): T | T[] {
        if (Array.isArray(entityOrEntities)) {
            if (!entityOrEntities.every(item => typeof item === 'object' && item !== null)) {
                throw new Error('Invalid input: expected an array of CreateInput objects.');
            }
        } else if (typeof entityOrEntities !== 'object' || entityOrEntities === null) {
            throw new Error('Invalid input: expected a CreateInput object.');
        }

        const result = Array.isArray(entityOrEntities)
            ? this.EntityRepository.Insert(entityOrEntities)
            : this.EntityRepository.Insert(entityOrEntities);

        this.CacheHandler.InvalidateCache();
        this.CacheHandler.RefreshCacheAsync();

        return result;
    }

    public async InsertAsync(entity: CreateInput): Promise<T>;
    public async InsertAsync(entities: CreateInput[]): Promise<T[]>;

    public async InsertAsync(entityOrEntities: CreateInput | CreateInput[]): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            if (!entityOrEntities.every(item => typeof item === 'object' && item !== null)) {
                throw new Error('Invalid input: expected an array of CreateInput objects.');
            }
        } else if (typeof entityOrEntities !== 'object' || entityOrEntities === null) {
            throw new Error('Invalid input: expected a CreateInput object.');
        }

        const result = Array.isArray(entityOrEntities)
            ? await this.EntityRepository.InsertAsync(entityOrEntities)
            : await this.EntityRepository.InsertAsync(entityOrEntities);

        this.CacheHandler.InvalidateCache();
        await this.CacheHandler.RefreshCacheAsync();

        return result;
    }

    public Update(entity: { id: number, data: UpdateInput }): T;
    public Update(entities: { id: number, data: UpdateInput }[]): T[];

    public Update(entityOrEntities: { id: number, data: UpdateInput } | { id: number, data: UpdateInput }[]): T | T[] {
        if (Array.isArray(entityOrEntities)) {
            if (!entityOrEntities.every(item => typeof item === 'object' && item !== null && 'id' in item && 'data' in item)) {
                throw new Error('Invalid input: expected an array of objects with id and data properties.');
            }
        } else if (typeof entityOrEntities !== 'object' || entityOrEntities === null || !('id' in entityOrEntities) || !('data' in entityOrEntities)) {
            throw new Error('Invalid input: expected an object with id and data properties.');
        }

        const result = Array.isArray(entityOrEntities)
            ? this.EntityRepository.Update(entityOrEntities)
            : this.EntityRepository.Update(entityOrEntities);

        this.CacheHandler.InvalidateCache();
        this.CacheHandler.RefreshCacheAsync();

        return result;
    }

    public async UpdateAsync(entity: { id: number, data: UpdateInput }): Promise<T>;
    public async UpdateAsync(entities: { id: number, data: UpdateInput }[]): Promise<T[]>;

    public async UpdateAsync(entityOrEntities: { id: number, data: UpdateInput } | { id: number, data: UpdateInput }[]): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            if (!entityOrEntities.every(item => typeof item === 'object' && item !== null && 'id' in item && 'data' in item)) {
                throw new Error('Invalid input: expected an array of objects with id and data properties.');
            }
        } else if (typeof entityOrEntities !== 'object' || entityOrEntities === null || !('id' in entityOrEntities) || !('data' in entityOrEntities)) {
            throw new Error('Invalid input: expected an object with id and data properties or an array of such objects.');
        }

        const result = Array.isArray(entityOrEntities)
            ? await this.EntityRepository.UpdateAsync(entityOrEntities)
            : await this.EntityRepository.UpdateAsync(entityOrEntities);

        this.CacheHandler.InvalidateCache();
        await this.CacheHandler.RefreshCacheAsync();

        return result;
    }

    public Delete(entity: T): T;
    public Delete(entities: T[]): T[];
    public Delete(predicate: (query: PrismaClient) => PrismaClient): T[];

    public Delete(
        entityOrEntitiesOrPredicate: T | T[] | ((query: PrismaClient) => PrismaClient)
    ): T | T[] {
        let result: T | T[];
        if (typeof entityOrEntitiesOrPredicate === 'function') {
            result = this.EntityRepository.Delete(entityOrEntitiesOrPredicate);
        } else if (Array.isArray(entityOrEntitiesOrPredicate)) {
            result = this.EntityRepository.Delete(entityOrEntitiesOrPredicate);
        } else {
            result = this.EntityRepository.Delete(entityOrEntitiesOrPredicate);
        }

        this.CacheHandler.InvalidateCache();
        this.CacheHandler.RefreshCacheAsync();

        return result;
    }

    public async DeleteAsync(entity: T): Promise<T>;
    public async DeleteAsync(entities: T[]): Promise<T[]>;
    public async DeleteAsync(predicate: (query: PrismaClient) => PrismaClient): Promise<T[]>;

    public async DeleteAsync(
        entityOrEntitiesOrPredicate: T | T[] | ((query: PrismaClient) => PrismaClient)
    ): Promise<T | T[]> {
        let result: T | T[];
        if (typeof entityOrEntitiesOrPredicate === 'function') {
            result = await this.EntityRepository.DeleteAsync(entityOrEntitiesOrPredicate);
        } else if (Array.isArray(entityOrEntitiesOrPredicate)) {
            result = await this.EntityRepository.DeleteAsync(entityOrEntitiesOrPredicate);
        } else {
            result = await this.EntityRepository.DeleteAsync(entityOrEntitiesOrPredicate);
        }

        this.CacheHandler.InvalidateCache();
        await this.CacheHandler.RefreshCacheAsync();

        return result;
    }
}
