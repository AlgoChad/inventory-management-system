import IConditionTypeService from "@/src/core/services/condition-type/IConditionTypeService";
import {
    CreateConditionTypeModel,
    UpdateConditionTypeModel,
    GetAllConditionTypePagedParams,
    ConditionTypeModel,
    ConditionTypeResult,
} from "@/src/data/models/condition-type/ConditionTypeModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import { PagedList } from "@/src/data/models/generic/PaginationModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import BaseController from "@/src/core/classes/BaseController";

class ConditionTypeController extends BaseController {
    private conditionTypeService: IConditionTypeService;
    protected authService: IAuthenticationService;

    constructor(
        conditionTypeService: IConditionTypeService,
        authService: IAuthenticationService
    ) {
        super(authService);
        this.conditionTypeService = conditionTypeService;
        this.authService = authService;
    }

    public async getAllConditionTypes(
        req: ApiRequest<GetAllConditionTypePagedParams, {}, {}>
    ): Promise<ApiResponse<PagedList<ConditionTypeModel>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<
                    PagedList<ConditionTypeModel>
                >;

            const query = req.query;
            const result = await this.conditionTypeService.GetAllConditionTypesPagedAsync(
                query
            );

            if (result.list.length > 0) {
                return CreateResponse<PagedList<ConditionTypeModel>>(
                    "success",
                    "ConditionTypes fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<PagedList<ConditionTypeModel>>(
                    "error",
                    "No ConditionTypes found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getConditionTypeById(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<ConditionTypeModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ConditionTypeModel>;

            const result = await this.conditionTypeService.GetConditionTypeByIdAsync(
                Number(req.params.id)
            );

            if (result.isSuccess) {
                return CreateResponse<ConditionTypeModel>(
                    "success",
                    result.message,
                    undefined,
                    result.conditionType
                );
            } else {
                return CreateResponse<ConditionTypeModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createConditionType(
        req: ApiRequest<{}, {}, CreateConditionTypeModel>
    ): Promise<ApiResponse<ConditionTypeModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ConditionTypeModel>;

            const result = await this.conditionTypeService.CreateConditionTypeAsync(
                req.body.payload
            );

            if (result.isSuccess) {
                return CreateResponse<ConditionTypeModel>(
                    "success",
                    result.message,
                    undefined,
                    result.conditionType
                );
            } else {
                return CreateResponse<ConditionTypeModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updateConditionType(
        req: ApiRequest<{}, { id: number }, UpdateConditionTypeModel>
    ): Promise<ApiResponse<ConditionTypeModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<ConditionTypeModel>;

            const result = await this.conditionTypeService.UpdateConditionTypeAsync(
                Number(req.params.id),
                req.body.payload
            );
            if (result.isSuccess) {
                return CreateResponse<ConditionTypeModel>(
                    "success",
                    result.message,
                    undefined,
                    result.conditionType
                );
            } else {
                return CreateResponse<ConditionTypeModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deleteConditionType(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<null> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<null>;

            const result = await this.conditionTypeService.DeleteConditionTypeAsync(
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

export default ConditionTypeController;
