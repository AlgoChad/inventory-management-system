import { Prisma, PrismaClient, Tool, ToolRepairRequest, ToolRequest } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', "error"]
});

const cacheManager: ICacheManager = new CacheManager(300);

class ToolRepairRequestRepository extends EntityRepository<ToolRepairRequest, Prisma.ToolRepairRequestCreateInput, Prisma.ToolRepairRequestUpdateInput> {
    constructor() {
        super(prisma.toolRepairRequest);
    }
}

class CachedToolRepairRequestRepositorySingleton {
    private static instance: CachedRepository<ToolRepairRequest, Prisma.ToolRepairRequestCreateInput, Prisma.ToolRepairRequestUpdateInput>;

    private constructor() {}

    public static getInstance(): CachedRepository<ToolRepairRequest, Prisma.ToolRepairRequestCreateInput, Prisma.ToolRepairRequestUpdateInput> {
        if (!CachedToolRepairRequestRepositorySingleton.instance) {
            const toolRepairRequestRepository = new ToolRepairRequestRepository();
            CachedToolRepairRequestRepositorySingleton.instance = new CachedRepository<ToolRepairRequest, Prisma.ToolRepairRequestCreateInput, Prisma.ToolRequestUpdateInput>(
                toolRepairRequestRepository,
                cacheManager,
                "ToolRepairRequestRepository"
            );
        }

        return CachedToolRepairRequestRepositorySingleton.instance;
    }
}

export default CachedToolRepairRequestRepositorySingleton.getInstance();
