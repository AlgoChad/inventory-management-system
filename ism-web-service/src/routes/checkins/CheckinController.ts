import ICheckinService from "@/src/core/services/checkins/ICheckinService";
import {
    CreateCheckinModel,
    UpdateCheckinModel,
    GetAllCheckinPagedParams,
    CheckinModel,
    CheckinResult,
} from "@/src/data/models/checkin/CheckinModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import { PagedList } from "@/src/data/models/generic/PaginationModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import BaseController from "@/src/core/classes/BaseController";

class CheckinController extends BaseController {
    private checkinService: ICheckinService;
    protected authService: IAuthenticationService;

    constructor(
        checkinService: ICheckinService,
        authService: IAuthenticationService
    ) {
        super(authService);
        this.checkinService = checkinService;
        this.authService = authService;
    }

    public async getAllCheckinsPaged(
        req: ApiRequest<GetAllCheckinPagedParams, {}, {}>
    ): Promise<ApiResponse<PagedList<CheckinModel>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<
                    PagedList<CheckinModel>
                >;

            const query = req.query;
            const result = await this.checkinService.GetAllCheckinsPagedAsync(
                query
            );

            if (result.list.length > 0) {
                return CreateResponse<PagedList<CheckinModel>>(
                    "success",
                    "Checkins fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<PagedList<CheckinModel>>(
                    "error",
                    "No Checkins found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getAllCheckins(
        req: ApiRequest<{}, {}, {}>
    ): Promise<ApiResponse<CheckinModel[]> | ProblemDetail> {
        try {
            const result = await this.checkinService.GetAllCheckinsAsync();

            if (result.length > 0) {
                return CreateResponse<CheckinModel[]>(
                    "success",
                    "Checkins fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<CheckinModel[]>(
                    "error",
                    "No Checkins found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getCheckinById(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<CheckinModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<CheckinModel>;

            const result = await this.checkinService.GetCheckinByIdAsync(
                Number(req.params.id)
            );

            if (result.isSuccess) {
                return CreateResponse<CheckinModel>(
                    "success",
                    result.message,
                    undefined,
                    result.checkin
                );
            } else {
                return CreateResponse<CheckinModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createCheckin(
        req: ApiRequest<{}, {}, CreateCheckinModel>
    ): Promise<ApiResponse<CheckinModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<CheckinModel>;

            const result = await this.checkinService.CreateCheckinAsync(
                req.body.payload
            );

            if (result.isSuccess) {
                return CreateResponse<CheckinModel>(
                    "success",
                    result.message,
                    undefined,
                    result.checkin
                );
            } else {
                return CreateResponse<CheckinModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updateCheckin(
        req: ApiRequest<{}, { id: number }, UpdateCheckinModel>
    ): Promise<ApiResponse<CheckinModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<CheckinModel>;

            const result = await this.checkinService.UpdateCheckinAsync(
                Number(req.params.id),
                req.body.payload
            );
            if (result.isSuccess) {
                return CreateResponse<CheckinModel>(
                    "success",
                    result.message,
                    undefined,
                    result.checkin
                );
            } else {
                return CreateResponse<CheckinModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deleteCheckin(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<null> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<null>;

            const result = await this.checkinService.DeleteCheckinAsync(
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

export default CheckinController;
