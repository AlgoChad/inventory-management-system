import IProjectService from "@/src/core/services/projects/IProjectService";
import {
    CreateProjectModel,
    UpdateProjectModel,
    GetAllProjectPagedParams,
    ProjectModel,
    ProjectResult,
} from "@/src/data/models/project/ProjectModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import { PagedList } from "@/src/data/models/generic/PaginationModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import BaseController from "@/src/core/classes/BaseController";

class ProjectController extends BaseController {
    private projectService: IProjectService;
    protected authService: IAuthenticationService;

    constructor(
        projectService: IProjectService,
        authService: IAuthenticationService
    ) {
        super(authService);
        this.projectService = projectService;
        this.authService = authService;
    }

    public async getAllProjects(
        req: ApiRequest<GetAllProjectPagedParams, {}, {}>
    ): Promise<ApiResponse<PagedList<ProjectModel>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<
                    PagedList<ProjectModel>
                >;

            const query = req.query;
            const result = await this.projectService.GetAllProjectsPagedAsync(
                query
            );

            if (result.list.length > 0) {
                return CreateResponse<PagedList<ProjectModel>>(
                    "success",
                    "Projects fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<PagedList<ProjectModel>>(
                    "error",
                    "No Projects found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getProjectById(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<ProjectModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ProjectModel>;

            const result = await this.projectService.GetProjectByIdAsync(
                Number(req.params.id)
            );

            if (result.isSuccess) {
                return CreateResponse<ProjectModel>(
                    "success",
                    result.message,
                    undefined,
                    result.project
                );
            } else {
                return CreateResponse<ProjectModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createProject(
        req: ApiRequest<{}, {}, CreateProjectModel>
    ): Promise<ApiResponse<ProjectModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ProjectModel>;

            const result = await this.projectService.CreateProjectAsync(
                req.body.payload
            );

            if (result.isSuccess) {
                return CreateResponse<ProjectModel>(
                    "success",
                    result.message,
                    undefined,
                    result.project
                );
            } else {
                return CreateResponse<ProjectModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updateProject(
        req: ApiRequest<{}, { id: number }, UpdateProjectModel>
    ): Promise<ApiResponse<ProjectModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ProjectModel>;

            const result = await this.projectService.UpdateProjectAsync(
                Number(req.params.id),
                req.body.payload
            );
            if (result.isSuccess) {
                return CreateResponse<ProjectModel>(
                    "success",
                    result.message,
                    undefined,
                    result.project
                );
            } else {
                return CreateResponse<ProjectModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deleteProject(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<null> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<null>;

            const result = await this.projectService.DeleteProjectAsync(
                Number(req.params.id)
            );
            if (result.isSuccess) {
                return CreateResponse<null>(
                    "success",
                    result.message,
                    undefined,
                    null
                );
            } else {
                return CreateResponse<null>(
                    "error",
                    result.message,
                    undefined,
                    null
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default ProjectController;
