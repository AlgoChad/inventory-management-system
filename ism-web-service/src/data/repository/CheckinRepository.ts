import { Checkin, Prisma, PrismaClient, User } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import EntityRepository from "./base/EntityRepository";
import { CacheManager } from "../caching/manager/CacheManager";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', "error"]
});

const cacheManager: ICacheManager = new CacheManager(300);

class CheckinRepository extends EntityRepository<Checkin, Prisma.CheckinCreateInput, Prisma.CheckinUpdateInput> {
    constructor () {
        super(prisma.checkin);
    }
}

class CachedCheckInRepositorySingleton {
    private static instance: CachedRepository<Checkin, Prisma.CheckinCreateInput, Prisma.CheckinUpdateInput>;

    private constructor() {}

    public static getInstance(): CachedRepository<Checkin, Prisma.CheckinCreateInput, Prisma.CheckinUpdateInput> {
        if (!CachedCheckInRepositorySingleton.instance) {
            const checkinRepository = new CheckinRepository();
            CachedCheckInRepositorySingleton.instance = new CachedRepository<Checkin, Prisma.CheckinCreateInput, Prisma.CheckinUpdateInput>(
                checkinRepository, 
                cacheManager,
                "CheckInRepository"
            );
        }

        return CachedCheckInRepositorySingleton.instance;
    }
}

export default CachedCheckInRepositorySingleton.getInstance();