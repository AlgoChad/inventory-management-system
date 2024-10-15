import { PrismaClient, ConditionType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

const cacheManager: ICacheManager = new CacheManager(300);

class ConditionTypeRepository extends EntityRepository<ConditionType, Prisma.ConditionTypeCreateInput, Prisma.ConditionTypeUpdateInput> {
    constructor() {
        super(prisma.conditionType);
    }
}

class CachedConditionTypeRepositorySingleton {
    private static instance: CachedRepository<ConditionType, Prisma.ConditionTypeCreateInput, Prisma.ConditionTypeUpdateInput>;

    private constructor() { }
    
    public static getInstance(): CachedRepository<ConditionType, Prisma.ConditionTypeCreateInput, Prisma.ConditionTypeUpdateInput> {
        if (!CachedConditionTypeRepositorySingleton.instance) {
            const conditionTypeRepository = new ConditionTypeRepository();
            CachedConditionTypeRepositorySingleton.instance = new CachedRepository<ConditionType, Prisma.ConditionTypeCreateInput, Prisma.ConditionTypeUpdateInput>(
                conditionTypeRepository, 
                cacheManager,
                "ConditionTypeRepository"
            );
        }

        return CachedConditionTypeRepositorySingleton.instance;
    }
}

export default CachedConditionTypeRepositorySingleton.getInstance();
