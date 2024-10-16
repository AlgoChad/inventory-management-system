import { PrismaClient } from '@prisma/client/extension';
import IRepository from './IRepository';
import { PagedList } from '@/src/data/models/generic/PaginationModel';

export default abstract class EntityRepository<T extends { id?: number | bigint | undefined }, CreateInput, UpdateInput> implements IRepository<T, CreateInput, UpdateInput> {
    protected ModelClient: typeof PrismaClient;

    constructor(Client: PrismaClient) {
        this.ModelClient = Client;
    }

    public GetEntity(
        func?: (query: PrismaClient) => T,
    ): T | undefined {
        try {
            const query = func ? func(this.ModelClient) : this.ModelClient.findFirst();
            return query as T | undefined;
        } catch (error) {
            console.error('Error fetching entity:', error);
            throw error;
        }
    }

    public async GetEntityAsync(
        func?: (query: PrismaClient) => Promise<T>,
    ): Promise<T | undefined> {
        try {
            const query = func ? func(this.ModelClient) : this.ModelClient.findFirst();
            return await query as T | undefined;
        } catch (error) {
            console.error('Error fetching entity:', error);
            throw error;
        }
    }

    public GetById(id: number, ): T | undefined;
    public GetById(id: bigint, ): T | undefined;

    public GetById(id: number | bigint, ): T | undefined {
        try {
            return this.ModelClient.findUnique({ where: { id } }) as T | undefined;
        } catch (error) {
            console.error('Error fetching entity by id:', error);
            throw error;
        }
    }

    public async GetByIdAsync(id: number): Promise<T | undefined>;
    public async GetByIdAsync(id: bigint): Promise<T | undefined>;

    public async GetByIdAsync(id: number | bigint): Promise<T | undefined> {
        try {
            return await this.ModelClient.findUnique({ where: { id } }) as T | undefined;
        } catch (error) {
            console.error('Error fetching entity by id:', error);
            throw error;
        }
    }

    public GetAll(
        func?: (query: PrismaClient) => T[]
    ): T[] {
        try {
            const query = func ? func(this.ModelClient) : this.ModelClient.findMany();
            return query;
        } catch (error) {
            console.error('Error fetching all entities:', error);
            throw error;
        }
    }

    public async GetAllAsync(
        func?: (query: PrismaClient) => Promise<T[]>
    ): Promise<T[]> {
        try {
            const query = func ? await func(this.ModelClient) : this.ModelClient.findMany();
            return query as T[];
        } catch (error) {
            console.error('Error fetching all entities:', error);
            throw error;
        }
    }

    public GetAllPaged(
        func?: (query: PrismaClient) => T[],
        pageIndex: number = 1,
        pageSize: number = 10,
    ): PagedList<T> {
        try {
            const skip = (pageIndex - 1) * pageSize;
            let allResults: T[] = [];
    
            if (func) {
                const result = func(this.ModelClient);
                allResults = result ?? [];
            } else {
                allResults = this.ModelClient.findMany({
                    skip,
                    take: pageSize
                }) as T[];
            }
    
            const totalCount = allResults.length;
            const paginatedResults = allResults.slice(skip, skip + pageSize);
    
            return {
                list: paginatedResults,
                pagination: {
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                    currentPage: pageIndex,
                    pageSize: pageSize
                }
            };
        } catch (error) {
            console.error('Error fetching paged entities:', error);
            throw error;
        }
    }
    
    public async GetAllPagedAsync(
        func?: (query: PrismaClient) => Promise<T[]>,
        pageIndex: number = 1,
        pageSize: number = 10,
    ): Promise<PagedList<T>> {
        try {
            const skip = (pageIndex - 1) * pageSize;
            let allResults: T[] = [];
    
            if (func) {
                const result = await func(this.ModelClient);
                allResults = result ?? [];
            } else {
                allResults = await this.ModelClient.findMany({
                    skip,
                    take: pageSize
                });
            }
    
            const totalCount = allResults.length;
            const paginatedResults = allResults.slice(skip, skip + pageSize);
    
            return {
                list: paginatedResults,
                pagination: {
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                    currentPage: pageIndex,
                    pageSize: pageSize
                }
            };
        } catch (error) {
            console.error('Error fetching paged entities:', error);
            throw error;
        }
    }

    public Insert(entity: CreateInput): T;
    public Insert(entities: CreateInput[]): T[];

    public Insert(entityOrEntities: CreateInput | CreateInput[]): T | T[] {
        try {
            if (Array.isArray(entityOrEntities)) {
                if (entityOrEntities.every(item => typeof item === 'object' && item !== null)) {
                    const data = this.ModelClient.createMany({ data: entityOrEntities });
                    return data as T[];
                } else {
                    throw new Error('Invalid input: expected an array of objects.');
                }
            } else if (typeof entityOrEntities === 'object' && entityOrEntities !== null) {
                const data = this.ModelClient.create({ data: entityOrEntities });
                return data as T;
            } else {
                throw new Error('Invalid input: expected an object or an array of objects.');
            }
        } catch (error) {
            console.error('Error inserting entity/entities:', error);
            throw error;
        }
    }

    public async InsertAsync(entity: CreateInput): Promise<T>;
    public async InsertAsync(entities: CreateInput[]): Promise<T[]>;

    public async InsertAsync(entityOrEntities: CreateInput | CreateInput[]): Promise<T | T[]> {
        try {
            if (Array.isArray(entityOrEntities)) {
                if (entityOrEntities.every(item => typeof item === 'object' && item !== null)) {
                    const data = await this.ModelClient.createMany({ data: entityOrEntities });
                    return data as T[];
                } else {
                    throw new Error('Invalid input: expected an array of objects.');
                }
            } else if (typeof entityOrEntities === 'object' && entityOrEntities !== null) {
                console.log ("test", entityOrEntities)
                const data = await this.ModelClient.create({ data: entityOrEntities });
                return data as T;
            } else {
                throw new Error('Invalid input: expected an object or an array of objects.');
            }
        } catch (error) {
            console.error('Error inserting entity/entities:', error);
            throw error;
        }
    }

    public Update(entity: { id: number, data: UpdateInput }): T;
    public Update(entities: { id: number, data: UpdateInput }[]): T[];

    public Update(entityOrEntities: { id: number, data: UpdateInput } | { id: number, data: UpdateInput }[]): T | T[] {
        try {
            if (Array.isArray(entityOrEntities)) {
                if (entityOrEntities.every(item => typeof item === 'object' && item !== null && 'id' in item && 'data' in item)) {
                    let updatedEntities: T[] = [];
                    entityOrEntities.forEach((entity) => {
                        updatedEntities.push(this.ModelClient.update({ where: { id: entity.id }, data: entity.data }));
                    });
                    return updatedEntities as T[];
                } else {
                    throw new Error('Invalid input: expected an array of objects with id and data properties.');
                }
            } else if (typeof entityOrEntities === 'object' && entityOrEntities !== null && 'id' in entityOrEntities && 'data' in entityOrEntities) {
                const data = this.ModelClient.update({
                    where: { id: entityOrEntities.id },
                    data: entityOrEntities.data
                });
                return data as T;
            } else {
                throw new Error('Invalid input: expected an object with id and data properties or an array of such objects.');
            }
        } catch (error) {
            console.error('Error updating entity/entities:', error);
            throw error;
        }
    }

    public async UpdateAsync(entity: { id: number, data: UpdateInput }): Promise<T>;
    public async UpdateAsync(entities: { id: number, data: UpdateInput }[]): Promise<T[]>;
    
    public async UpdateAsync(entityOrEntities: { id: number, data: UpdateInput } | { id: number, data: UpdateInput }[]): Promise<T | T[]> {
        try {
            if (Array.isArray(entityOrEntities)) {
                if (entityOrEntities.every(item => typeof item === 'object' && item !== null && 'id' in item && 'data' in item)) {
                    const results = await Promise.all(entityOrEntities.map(async (entity) => {
                        const updatedEntity = await this.ModelClient.update({
                            where: { id: entity.id },
                            data: entity.data
                        });
                        return updatedEntity;
                    }));
                    return results as T[];
                } else {
                    throw new Error('Invalid input: expected an array of objects with id and data properties.');
                }
            } else if (typeof entityOrEntities === 'object' && entityOrEntities !== null && 'id' in entityOrEntities && 'data' in entityOrEntities) {
                const updatedEntity = await this.ModelClient.update({
                    where: { id: entityOrEntities.id },
                    data: entityOrEntities.data
                });
                return updatedEntity as T;
            } else {
                throw new Error('Invalid input: expected an object with id and data properties or an array of such objects.');
            }
        } catch (error) {
            console.error('Error updating entity/entities:', error);
            throw error;
        }
    }

    public Delete(entity: T): T;
    public Delete(entities: T[]): T[];
    public Delete(predicate: (query: PrismaClient) => PrismaClient): T[];

    public Delete(entityOrEntitiesOrPredicate: T | T[] | ((query: PrismaClient) => PrismaClient)): T | T[] {
        try {
            if (Array.isArray(entityOrEntitiesOrPredicate)) {
                this.ModelClient.deleteMany({ where: { id: { in: entityOrEntitiesOrPredicate.map(e => e.id) } } });
                return entityOrEntitiesOrPredicate;
            } else if (typeof entityOrEntitiesOrPredicate === 'function') {
                const query = entityOrEntitiesOrPredicate(this.ModelClient);
                query.deleteMany();
                return [];
            } else {
                this.ModelClient.delete({ where: { id: entityOrEntitiesOrPredicate.id } });
                return entityOrEntitiesOrPredicate;
            }
        } catch (error) {
            console.error('Error deleting entity/entities:', error);
            throw error;
        }
    }

    public async DeleteAsync(entity: T): Promise<T>;
    public async DeleteAsync(entities: T[]): Promise<T[]>;
    public async DeleteAsync(predicate: (query: PrismaClient) => PrismaClient): Promise<T[]>;

    public async DeleteAsync(entityOrEntitiesOrPredicate: T | T[] | ((query: PrismaClient) => PrismaClient)): Promise<T | T[]> {
        try {
            if (Array.isArray(entityOrEntitiesOrPredicate)) {
                await this.ModelClient.deleteMany({ where: { id: { in: entityOrEntitiesOrPredicate.map(e => e.id) } } });
                return entityOrEntitiesOrPredicate;
            } else if (typeof entityOrEntitiesOrPredicate === 'function') {
                const query = entityOrEntitiesOrPredicate(this.ModelClient);
                await query.deleteMany();
                return [];
            } else {
                await this.ModelClient.delete({ where: { id: entityOrEntitiesOrPredicate.id}});
                return entityOrEntitiesOrPredicate;
            }
        } catch (error) {
            console.error('Error deleting entity/entities:', error);
            throw error;
        }
    }
}
