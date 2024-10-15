import IStatusTypeService from "@/src/core/services/status-type/IStatusTypeService";
import {
    CreateStatusTypeModel,
    UpdateStatusTypeModel,
    GetAllStatusTypePagedParams,
    StatusTypeModel,
    StatusTypeResult,
} from "@/src/data/models/status-type/StatusTypeModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import { PagedList } from "@/src/data/models/generic/PaginationModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import BaseController from "@/src/core/classes/BaseController";

class StatusTypeController extends BaseController {
    private statusTypeService: IStatusTypeService;
    protected authService: IAuthenticationService;

    constructor(
        statusTypeService: IStatusTypeService,
        authService: IAuthenticationService
    ) {
        super(authService);
        this.statusTypeService = statusTypeService;
        this.authService = authService;
    }

    public async getAllStatusTypes(
        req: ApiRequest<GetAllStatusTypePagedParams, {}, {}>
    ): Promise<ApiResponse<PagedList<StatusTypeModel>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<
                    PagedList<StatusTypeModel>
                >;

            const query = req.query;
            const result = await this.statusTypeService.GetAllStatusTypesPagedAsync(
                query
            );

            if (result.list.length > 0) {
                return CreateResponse<PagedList<StatusTypeModel>>(
                    "success",
                    "StatusTypes fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<PagedList<StatusTypeModel>>(
                    "error",
                    "No StatusTypes found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getStatusTypeById(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<StatusTypeModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<StatusTypeModel>;

            const result = await this.statusTypeService.GetStatusTypeByIdAsync(
                Number(req.params.id)
            );

            if (result.isSuccess) {
                return CreateResponse<StatusTypeModel>(
                    "success",
                    result.message,
                    undefined,
                    result.statusType
                );
            } else {
                return CreateResponse<StatusTypeModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createStatusType(
        req: ApiRequest<{}, {}, CreateStatusTypeModel>
    ): Promise<ApiResponse<StatusTypeModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<StatusTypeModel>;

            const result = await this.statusTypeService.CreateStatusTypeAsync(
                req.body.payload
            );

            if (result.isSuccess) {
                return CreateResponse<StatusTypeModel>(
                    "success",
                    result.message,
                    undefined,
                    result.statusType
                );
            } else {
                return CreateResponse<StatusTypeModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updateStatusType(
        req: ApiRequest<{}, { id: number }, UpdateStatusTypeModel>
    ): Promise<ApiResponse<StatusTypeModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<StatusTypeModel>;

            const result = await this.statusTypeService.UpdateStatusTypeAsync(
                Number(req.params.id),
                req.body.payload
            );
            if (result.isSuccess) {
                return CreateResponse<StatusTypeModel>(
                    "success",
                    result.message,
                    undefined,
                    result.statusType
                );
            } else {
                return CreateResponse<StatusTypeModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deleteStatusType(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<null> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<null>;

            const result = await this.statusTypeService.DeleteStatusTypeAsync(
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

export default StatusTypeController;
