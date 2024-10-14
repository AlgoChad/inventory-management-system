import { PrismaClient } from "@prisma/client";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

export default interface IRepository<T, CreateInput, UpdateInput> {
    GetEntity(
        func?: (query: PrismaClient) => T
    ): T | undefined;

    GetEntityAsync(
        func?: (query: PrismaClient) => Promise<T>
    ): Promise<T | undefined>;

    GetById(id: number): T | undefined;
    GetByIdAsync(id: number): Promise<T | undefined>;

    GetById(id: bigint): T | undefined;
    GetByIdAsync(id: bigint): Promise<T | undefined>;

    GetAll(
        func?: (query: PrismaClient) => T[]
    ): T[];

    GetAllAsync(
        func?: (query: PrismaClient) => Promise<T[]>
    ): Promise<T[]>;

    GetAllPaged(
        func?: (query: PrismaClient) => T[],
        pageIndex?: number,
        pageSize?: number
    ): PagedList<T>;

    GetAllPagedAsync(
        func?: (query: PrismaClient) => Promise<T[]>,
        pageIndex?: number,
        pageSize?: number
    ): Promise<PagedList<T>>;

    Insert(entity: CreateInput): T;
    Insert(entities: CreateInput[]): T[];
    InsertAsync(entity: CreateInput): Promise<T>;
    InsertAsync(entities: CreateInput[]): Promise<T[]>;

    Update(entity: { id: number, data: UpdateInput }): T;
    Update(entities: { id: number, data: UpdateInput }[]): T[];
    UpdateAsync(entity: {id: number, data: UpdateInput}): Promise<T>;
    UpdateAsync(entities: { id: number, data: UpdateInput }[]): Promise<T[]>;

    Delete(entity: T): T;
    Delete(entities: T[]): T[];
    Delete(predicate: (query: PrismaClient) => PrismaClient): T[];
    
    DeleteAsync(entity: T): Promise<T>;
    DeleteAsync(entities: T[]): Promise<T[]>;
    DeleteAsync(predicate: (query: PrismaClient) => PrismaClient): Promise<T[]>;
}