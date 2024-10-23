import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import {
    ProjectModel,
    CreateProjectModel,
    UpdateProjectModel,
    ProjectResult,
    GetAllProjectPagedParams,
} from "@/src/data/models/project/ProjectModel";
import IProjectService from "./IProjectService";
import ProjectRepository from "@/src/data/repository/ProjectRepository";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

class ProjectService implements IProjectService {
    private readonly _repository: typeof ProjectRepository;

    constructor() {
        this._repository = ProjectRepository;
    }

    public async CreateProjectAsync(
        createProjectModel: CreateProjectModel
    ): Promise<ProjectResult> {
        try {
            const project = await this._repository.InsertAsync(
                createProjectModel
            );
            return {
                isSuccess: true,
                message: "Project created successfully",
                project: project as ProjectModel,
            };
        } catch (error) {
            console.error("Error creating project:", error);
            return {
                isSuccess: false,
                message: "Project creation failed",
            };
        }
    }

    public async GetProjectByIdAsync(id: number): Promise<ProjectResult> {
        try {
            const project = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                        include: {
                            Checkin: true,
                        },
                    });
                }
            );

            if (project) {
                return {
                    isSuccess: true,
                    message: "Project retrieved successfully",
                    project: project as ProjectModel,
                };
            } else {
                return {
                    isSuccess: false,
                    message: "Project not found",
                };
            }
        } catch (error) {
            console.error("Error retrieving project:", error);
            return {
                isSuccess: false,
                message: "Project retrieval failed",
            };
        }
    }

    public async UpdateProjectAsync(
        id: number,
        updateProjectModel: UpdateProjectModel
    ): Promise<ProjectResult> {
        try {
            const project = await this._repository.UpdateAsync({
                id,
                data: updateProjectModel,
            });

            return {
                isSuccess: true,
                message: "Project updated successfully",
                project: project as ProjectModel,
            };
        } catch (error) {
            console.error("Error updating project:", error);
            return {
                isSuccess: false,
                message: "Project update failed",
            };
        }
    }

    public async DeleteProjectAsync(id: number): Promise<ProjectResult> {
        try {
            const projectResult = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                    });
                }
            );

            if (!projectResult) {
                return {
                    isSuccess: false,
                    message: "Project not found",
                };
            }

            await this._repository.DeleteAsync(projectResult);

            return {
                isSuccess: true,
                message: "Project deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting project:", error);
            return {
                isSuccess: false,
                message: "Project deletion failed",
            };
        }
    }

    public async GetAllProjectsAsync(): Promise<ProjectModel[]> {
        try {
            const projects = await this._repository.GetAllAsync(
                async (query: PrismaClient) => {
                    return await query.findMany();
                }
            );
            return projects as ProjectModel[];
        } catch (error) {
            console.error("Error retrieving projects:", error);
            throw new Error("Projects retrieval failed");
        }
    }

    public async GetAllProjectsPagedAsync(
        params: GetAllProjectPagedParams
    ): Promise<PagedList<ProjectModel>> {
        const { page, limit, search, column, direction } = params;
        try {
            const result = await this._repository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const orderBy: { [key: string]: 'asc' | 'desc' } = {};

                    if (column && direction) {
                        orderBy[column] = direction;
                    }
            
                    const result = await query.findMany({
                        orderBy: orderBy,
                    });
            
                    return result;
                }, page, limit
            );
            return result as PagedList<ProjectModel>;
        } catch (error) {
            console.error("Error retrieving projects:", error);
            throw new Error("Projects retrieval failed");
        }
    }
}

export default ProjectService;
