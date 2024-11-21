import { PrismaClient, Prisma, Image } from "@prisma/client";
import { ICacheManager } from "../caching/manager/ICacheManager";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', "error"]
});

const cacheManager: ICacheManager = new CacheManager(300);

class ImageRepository extends EntityRepository<Image, Prisma.ImageCreateInput, Prisma.ImageUpdateInput> {
    constructor() {
        super(prisma.image);
    }
}

class CachedImageRepositorySingleton {
    private static instance: CachedRepository<Image, Prisma.ImageCreateInput, Prisma.ImageUpdateInput>;

    private constructor() {}

    public static getInstance(): CachedRepository<Image, Prisma.ImageCreateInput, Prisma.ImageUpdateInput> {
        if (!CachedImageRepositorySingleton.instance) {
            const imageRepository = new ImageRepository();
            CachedImageRepositorySingleton.instance = new CachedRepository<Image, Prisma.ImageCreateInput, Prisma.ImageUpdateInput>(
                imageRepository,
                cacheManager,
                "ImageRepository"
            );
        }

        return CachedImageRepositorySingleton.instance;
    }
}

export default CachedImageRepositorySingleton.getInstance();
