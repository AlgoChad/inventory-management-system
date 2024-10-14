import { Prisma, PrismaClient, StatusType } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";


const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

const cacheManager: ICacheManager = new CacheManager(300);

class StatusTypeRepisotory extends EntityRepository<StatusType, Prisma.StatusTypeCreateInput, Prisma.StatusTypeUpdateInput> {
    constructor() {
        super(prisma.statusType);
    }
}

class CachedStatusTypeRepositorySingleton {
    private static instance: CachedRepository<StatusType, Prisma.StatusTypeCreateInput, Prisma.StatusTypeUpdateInput>;

    private constructor() { }
    
    public static getInstance(): CachedRepository<StatusType, Prisma.StatusTypeCreateInput, Prisma.StatusTypeUpdateInput> { 
        if (!CachedStatusTypeRepositorySingleton.instance) {
            const statusTypeRepository = new StatusTypeRepisotory();
            CachedStatusTypeRepositorySingleton.instance = new CachedRepository<StatusType, Prisma.StatusTypeCreateInput, Prisma.StatusTypeUpdateInput>(
                statusTypeRepository, 
                cacheManager,
                "StatusTypeRepository"
            );
        }

        return CachedStatusTypeRepositorySingleton.instance;
    }
}

export default CachedStatusTypeRepositorySingleton.getInstance();