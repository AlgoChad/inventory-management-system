import { Prisma, PrismaClient, Project } from "@prisma/client";
import { CacheManager } from "../caching/manager/CacheManager";
import EntityRepository from "./base/EntityRepository";
import CachedRepository from "./base/CachedRepository";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', "error"]
});

const cacheManager = new CacheManager(300);

class ProjectRepository extends EntityRepository<Project, Prisma.ProjectCreateInput, Prisma.ProjectUpdateInput> {
    constructor () {
        super(prisma.project);
    }
}

class CachedProjectRepositorySingleton {
    private static instance: CachedRepository<Project, Prisma.ProjectCreateInput, Prisma.ProjectUpdateInput>;

    private constructor() {}

    public static getInstance(): CachedRepository<Project, Prisma.ProjectCreateInput, Prisma.ProjectUpdateInput> {
        if (!CachedProjectRepositorySingleton.instance) {
            const projectRepository = new ProjectRepository();
            CachedProjectRepositorySingleton.instance = new CachedRepository<Project, Prisma.ProjectCreateInput, Prisma.ProjectUpdateInput>(
                projectRepository, 
                cacheManager,
                "ProjectRepository"
            );
        }

        return CachedProjectRepositorySingleton.instance;
    }
}

export default CachedProjectRepositorySingleton.getInstance();