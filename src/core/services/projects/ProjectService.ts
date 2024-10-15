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
                    return await query.project.findFirst({
                        where: { id },
                        include: {
                            tools: true,
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
                    return await query.project.findFirst({
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

    public async GetAllProjectsPagedAsync(
        params: GetAllProjectPagedParams
    ): Promise<PagedList<ProjectModel>> {
        const { page, limit, search } = params;
        try {
            const where: Prisma.ProjectWhereInput = {
                projectDescription: {
                    contains: search,
                    mode: "insensitive",
                },
            };

            const result = await this._repository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const result = await query.project.findMany({
                        where,
                        include: {
                            tools: true,
                            checkins: true,
                        },
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
