import IToolService from "@/src/core/services/tools/IToolService";
import {
    CreateToolModel,
    UpdateToolModel,
    GetAllToolPagedParams,
    ToolModel,
    ToolResult,
} from "@/src/data/models/tool/ToolModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import { PagedList } from "@/src/data/models/generic/PaginationModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import BaseController from "@/src/core/classes/BaseController";

class ToolController extends BaseController {
    private toolService: IToolService;
    protected authService: IAuthenticationService;

    constructor(
        toolService: IToolService,
        authService: IAuthenticationService
    ) {
        super(authService);
        this.toolService = toolService;
        this.authService = authService;
    }

    public async getAllToolsPaged(
        req: ApiRequest<GetAllToolPagedParams, {}, {}>
    ): Promise<ApiResponse<PagedList<ToolModel>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<
                    PagedList<ToolModel>
                >;

            const query = req.query;
            const result = await this.toolService.GetAllToolsPagedAsync(query);

            if (result.list.length > 0) {
                return CreateResponse<PagedList<ToolModel>>(
                    "success",
                    "Tools fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<PagedList<ToolModel>>(
                    "error",
                    "No Tools found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getAllTools(
        req: ApiRequest<{}, {}, {}>
    ): Promise<ApiResponse<ToolModel[]> | ProblemDetail> {
        try {
            const result = await this.toolService.GetAllToolsAsync();
            if (result.length > 0) {
                return CreateResponse<ToolModel[]>(
                    "success",
                    "Tools fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<ToolModel[]>(
                    "error",
                    "No Tools found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getToolById(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<ToolModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ToolModel>;

            const result = await this.toolService.GetToolByIdAsync(
                Number(req.params.id)
            );

            if (result.isSuccess) {
                return CreateResponse<ToolModel>(
                    "success",
                    result.message,
                    undefined,
                    result.tool
                );
            } else {
                return CreateResponse<ToolModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createTool(
        req: ApiRequest<{}, {}, CreateToolModel>
    ): Promise<ApiResponse<ToolModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ToolModel>;

            const result = await this.toolService.CreateToolAsync(
                req.body.payload
            );

            if (result.isSuccess) {
                return CreateResponse<ToolModel>(
                    "success",
                    result.message,
                    undefined,
                    result.tool
                );
            } else {
                return CreateResponse<ToolModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updateTool(
        req: ApiRequest<{}, { id: number }, UpdateToolModel>
    ): Promise<ApiResponse<ToolModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ToolModel>;

            const result = await this.toolService.UpdateToolAsync(
                Number(req.params.id),
                req.body.payload
            );
            if (result.isSuccess) {
                return CreateResponse<ToolModel>(
                    "success",
                    result.message,
                    undefined,
                    result.tool
                );
            } else {
                return CreateResponse<ToolModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deleteTool(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<null> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<null>;

            const result = await this.toolService.DeleteToolAsync(
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

export default ToolController;
