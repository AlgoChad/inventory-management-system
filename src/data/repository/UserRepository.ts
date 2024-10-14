import { Prisma, PrismaClient, User } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', "error"]
});

const cacheManager: ICacheManager = new CacheManager(300);

class UserRepository extends EntityRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
    constructor () {
        super(prisma.user);
    }
}   

class CachedUserRepositorySingleton {
    private static instance: CachedRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput>;

    private constructor() {}

    public static getInstance(): CachedRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput> {
        if (!CachedUserRepositorySingleton.instance) {
            const userRepository = new UserRepository();
            CachedUserRepositorySingleton.instance = new CachedRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput>(
                userRepository, 
                cacheManager,
                "UserRepository"
            );
        }

        return CachedUserRepositorySingleton.instance;
    }
}

export default CachedUserRepositorySingleton.getInstance();