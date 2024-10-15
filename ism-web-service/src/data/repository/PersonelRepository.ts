import { Personnel, Prisma, PrismaClient } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

const cacheManager: ICacheManager = new CacheManager(300);

class PersonelRepository extends EntityRepository<Personnel, Prisma.PersonnelCreateInput, Prisma.PersonnelUpdateInput> {
    constructor() {
        super(prisma.personnel);
    }
}

class CachedPersonelRepositorySingleton {
    private static instance: CachedRepository<Personnel, Prisma.PersonnelCreateInput, Prisma.PersonnelUpdateInput>;

    private constructor() { }
    
    public static getInstance(): CachedRepository<Personnel, Prisma.PersonnelCreateInput, Prisma.PersonnelUpdateInput> {
        if (!CachedPersonelRepositorySingleton.instance) {
            const personelRepository = new PersonelRepository();
            CachedPersonelRepositorySingleton.instance = new CachedRepository<Personnel, Prisma.PersonnelCreateInput, Prisma.PersonnelUpdateInput>(
                personelRepository, 
                cacheManager,
                "PersonelRepository"
            );
        }
        return CachedPersonelRepositorySingleton.instance;
    }
}

export default CachedPersonelRepositorySingleton.getInstance();