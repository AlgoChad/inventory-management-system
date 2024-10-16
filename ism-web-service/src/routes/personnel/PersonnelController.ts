import IPersonnelService from "@/src/core/services/personnel/IPersonnelService";
import {
    CreatePersonnelModel,
    UpdatePersonnelModel,
    GetAllPersonnelPagedParams,
    PersonnelModel,
    PersonnelResult,
} from "@/src/data/models/personnel/PersonnelModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import { PagedList } from "@/src/data/models/generic/PaginationModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import BaseController from "@/src/core/classes/BaseController";

class PersonnelController extends BaseController {
    private personnelService: IPersonnelService;
    protected authService: IAuthenticationService;

    constructor(
        personnelService: IPersonnelService,
        authService: IAuthenticationService
    ) {
        super(authService);
        this.personnelService = personnelService;
        this.authService = authService;
    }

    public async getAllPersonnelPaged(
        req: ApiRequest<GetAllPersonnelPagedParams, {}, {}>
    ): Promise<ApiResponse<PagedList<PersonnelModel>> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<
                    PagedList<PersonnelModel>
                >;

            const query = req.query;
            const result = await this.personnelService.GetAllPersonnelPagedAsync(
                query
            );

            if (result.list.length > 0) {
                return CreateResponse<PagedList<PersonnelModel>>(
                    "success",
                    "Personnel fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<PagedList<PersonnelModel>>(
                    "error",
                    "No personnel found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getAllPersonnel(
        req: ApiRequest<{}, {}, {}>
    ): Promise<ApiResponse<PersonnelModel[]> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<PersonnelModel[]>;

            const result = await this.personnelService.GetAllPersonnelAsync();

            if (result.length > 0) {
                return CreateResponse<PersonnelModel[]>(
                    "success",
                    "Personnel fetched successfully",
                    undefined,
                    result
                );
            } else {
                return CreateResponse<PersonnelModel[]>(
                    "error",
                    "No personnel found",
                    undefined,
                    result
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async getPersonnelById(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<PersonnelModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<PersonnelModel>;

            const result = await this.personnelService.GetPersonnelByIdAsync(
                Number(req.params.id)
            );

            if (result.isSuccess) {
                return CreateResponse<PersonnelModel>(
                    "success",
                    result.message,
                    undefined,
                    result.personnel
                );
            } else {
                return CreateResponse<PersonnelModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async createPersonnel(
        req: ApiRequest<{}, {}, CreatePersonnelModel>
    ): Promise<ApiResponse<PersonnelModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<PersonnelModel>;

            const result = await this.personnelService.CreatePersonnelAsync(
                req.body.payload
            );

            if (result.isSuccess) {
                return CreateResponse<PersonnelModel>(
                    "success",
                    result.message,
                    undefined,
                    result.personnel
                );
            } else {
                return CreateResponse<PersonnelModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async updatePersonnel(
        req: ApiRequest<{}, { id: number }, UpdatePersonnelModel>
    ): Promise<ApiResponse<PersonnelModel> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<PersonnelModel>;

            const result = await this.personnelService.UpdatePersonnelAsync(
                Number(req.params.id),
                req.body.payload
            );
            if (result.isSuccess) {
                return CreateResponse<PersonnelModel>(
                    "success",
                    result.message,
                    undefined,
                    result.personnel
                );
            } else {
                return CreateResponse<PersonnelModel>(
                    "error",
                    result.message,
                    undefined
                );
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async deletePersonnel(
        req: ApiRequest<{}, { id: number }, {}>
    ): Promise<ApiResponse<null> | ProblemDetail> {
        try {
            const validationError = await this.validateAccessToken(req);
            if (validationError)
                return validationError as unknown as ApiResponse<null>;

            const result = await this.personnelService.DeletePersonnelAsync(
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

export default PersonnelController;
