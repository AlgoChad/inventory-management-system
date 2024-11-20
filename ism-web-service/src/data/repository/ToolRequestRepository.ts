import { PrismaClient, Prisma, ToolRequest } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', "error"]
});

const cacheManager: ICacheManager = new CacheManager(300);

class ToolRequestRepository extends EntityRepository<ToolRequest, Prisma.ToolRequestCreateInput, Prisma.ToolRequestUpdateInput> {
    constructor() {
        super(prisma.toolRequest);
    }
}

class CachedToolRequestRepositorySingleton {
    private static instance: CachedRepository<ToolRequest, Prisma.ToolRequestCreateInput, Prisma.ToolRequestUpdateInput>;

    private constructor() {}

    public static getInstance(): CachedRepository<ToolRequest, Prisma.ToolRequestCreateInput, Prisma.ToolRequestUpdateInput> {
        if (!CachedToolRequestRepositorySingleton.instance) {
            const toolRequestRepository = new ToolRequestRepository();
            CachedToolRequestRepositorySingleton.instance = new CachedRepository<ToolRequest, Prisma.ToolRequestCreateInput, Prisma.ToolRequestUpdateInput>(
                toolRequestRepository,
                cacheManager,
                "ToolRequestRepository"
            );
        }

        return CachedToolRequestRepositorySingleton.instance;
    }
}

export default CachedToolRequestRepositorySingleton.getInstance();
