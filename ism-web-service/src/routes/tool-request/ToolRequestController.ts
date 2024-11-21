import {
    RequestResult,
    CreateToolRequestModel,
    UpdateToolRequestModel,
    CreateToolRepairRequestModel,
    UpdateToolRepairRequestModel,
    ToolRequest,
    ToolRepairRequest,
} from "@/src/data/models/tool/ToolModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import BaseController from "@/src/core/classes/BaseController";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import IToolRequestService from "@/src/core/services/tool-request/IToolRequestService";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

class ToolRequestController extends BaseController {
    private toolRequestService: IToolRequestService;
    protected authService: IAuthenticationService;

    constructor(toolRequestService: IToolRequestService, authService: IAuthenticationService) {
        super(authService);
        this.toolRequestService = toolRequestService;
        this.authService = authService;
    }

    public async getAllToolRequests(
        req: ApiRequest<{ page: number; limit: number; search?: string; column?: string; direction?: "asc" | "desc" }, {}, {}>
    ): Promise<ApiResponse<PagedList<ToolRequest>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<PagedList<ToolRequest>>;

            const result = await this.toolRequestService.GetAllToolsRequestPagedAsync(req.query);
            return CreateResponse<PagedList<ToolRequest>>(
                "success",
                "Tool requests retrieved successfully",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getAllToolRepairRequests(
        req: ApiRequest<{ page: number; limit: number; search?: string; column?: string; direction?: "asc" | "desc" }, {}, {}>
    ): Promise<ApiResponse<PagedList<ToolRepairRequest>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<PagedList<ToolRepairRequest>>;

            const result = await this.toolRequestService.GetAllToolsRepairRequestPagedAsync(req.query);
            return CreateResponse<PagedList<ToolRepairRequest>>(
                "success",
                "Tool repair requests retrieved successfully",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getToolRequestById(
        req: ApiRequest<{}, {id: number}, {}>
    ): Promise<ApiResponse<ToolRequest> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<ToolRequest>;

            const result: ToolRequest = (await this.toolRequestService.GetToolRequestByIdAsync(req.params.id)) as ToolRequest;
            if (!result) {
                return CreateResponse<ToolRequest>(
                    "error",
                    "Tool request not found",
                    undefined,
                    result
                );
            }
            return CreateResponse<ToolRequest>(
                "success",
                "Tool request retrieved successfully",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getToolRepairRequestById(
        req: ApiRequest<{}, {id: number}, {}>
    ): Promise<ApiResponse<ToolRepairRequest> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<ToolRepairRequest>;

            const result: ToolRepairRequest = (await this.toolRequestService.GetToolRepairRequestByIdAsync(req.params.id)) as ToolRepairRequest;
            if (!result) {
                return CreateResponse<ToolRepairRequest>(
                    "error",
                    "Tool repair request not found",
                    undefined,
                    result
                );
            }
            return CreateResponse<ToolRepairRequest>(
                "success",
                "Tool repair request retrieved successfully",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createToolRequest(
        req: ApiRequest<{}, {}, CreateToolRequestModel>
    ): Promise<ApiResponse<RequestResult> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<RequestResult>;

            const result = await this.toolRequestService.CreateToolRequestAsync(req.body.payload);
            return CreateResponse<RequestResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Tool request created successfully" : "Tool request creation failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createToolRepairRequest(
        req: ApiRequest<{}, {}, CreateToolRepairRequestModel>
    ): Promise<ApiResponse<RequestResult> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<RequestResult>;

            const result = await this.toolRequestService.CreateToolRepairRequestAsync(req.body.payload);
            return CreateResponse<RequestResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Tool repair request created successfully" : "Tool repair request creation failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updateToolRequest(
        req: ApiRequest<{}, { id: number }, UpdateToolRequestModel>
    ): Promise<ApiResponse<RequestResult> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<RequestResult>;

            const result = await this.toolRequestService.UpdateToolRequestAsync(req.params.id, req.body.payload);
            return CreateResponse<RequestResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Tool request updated successfully" : "Tool request update failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updateToolRepairRequest(
        req: ApiRequest<{}, { id: number }, UpdateToolRepairRequestModel>
    ): Promise<ApiResponse<RequestResult> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<RequestResult>;

            const result = await this.toolRequestService.UpdateToolRepairRequestAsync(req.params.id, req.body.payload);
            return CreateResponse<RequestResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Tool repair request updated successfully" : "Tool repair request update failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deleteToolRequest(
        req: ApiRequest<{}, {id: number}, {}>
    ): Promise<ApiResponse<RequestResult> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<RequestResult>;

            const result = await this.toolRequestService.DeleteToolRequestAsync(req.params.id);
            return CreateResponse<RequestResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Tool request deleted successfully" : "Tool request deletion failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deleteToolRepairRequest(
        req: ApiRequest<{}, {id: number}, {}>
    ): Promise<ApiResponse<RequestResult> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError) return validationError as unknown as ApiResponse<RequestResult>;

            const result = await this.toolRequestService.DeleteToolRepairRequestAsync(req.params.id);
            return CreateResponse<RequestResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Tool repair request deleted successfully" : "Tool repair request deletion failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default ToolRequestController;
