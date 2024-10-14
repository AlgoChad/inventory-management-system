import { Prisma, PrismaClient, Tool } from "@prisma/client";
import { CacheManager } from "../caching/manager/CacheManager";
import { ICacheManager } from "../caching/manager/ICacheManager"
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', "error"]
})

const cacheManger: ICacheManager = new CacheManager(300);

class ToolRepository extends EntityRepository<Tool, Prisma.ToolCreateInput, Prisma.ToolUpdateInput> {
    constructor () {
        super(prisma.tool);
    }
}

class CachedToolRepositorySingleton {
    private static instance: CachedRepository<Tool, Prisma.ToolCreateInput, Prisma.ToolUpdateInput>;

    private constructor() {}

    public static getInstance(): CachedRepository<Tool, Prisma.ToolCreateInput, Prisma.ToolUpdateInput> {
        if (!CachedToolRepositorySingleton.instance) {
            const toolRepository = new ToolRepository();
            CachedToolRepositorySingleton.instance = new CachedRepository<Tool, Prisma.ToolCreateInput, Prisma.ToolUpdateInput>(
                toolRepository, 
                cacheManger,
                "ToolRepository"
            );
        }

        return CachedToolRepositorySingleton.instance;
    }
}

export default CachedToolRepositorySingleton.getInstance();