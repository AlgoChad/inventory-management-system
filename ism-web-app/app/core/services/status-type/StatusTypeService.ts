import { 
    StatusTypeModel, 
    CreateStatusTypeModel, 
    UpdateStatusTypeModel, 
    GetAllStatusTypePagedParams 
} from "@/app/data/models/status-type/StatusTypeModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";
import { ApiResponse } from "@/app/data/models/generic/ApiModel";
import RestClient from "@/app/data/rest/RestClient";
import IStatusTypeService from "./IStatusTypeService";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;

class StatusTypeService implements IStatusTypeService {
    private restClient: RestClient;

    constructor() {
        this.restClient = new RestClient(API_BASE_URL, API_TOKEN);
    }

    private async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
        if (response.status) {
            return response.data as T;
        }
        throw new Error("Invalid response from server");
    }

    async CreateStatusTypeAsync(createStatusTypeModel: CreateStatusTypeModel): Promise<StatusTypeModel> {
        const response = await this.restClient.Post<ApiResponse<StatusTypeModel>>("/status-types", { payload: createStatusTypeModel });
        return this.handleResponse(response);
    }

    async GetStatusTypeByIdAsync(id: number): Promise<StatusTypeModel> {
        const response = await this.restClient.Get<ApiResponse<StatusTypeModel>>(`/status-types/${id}`);
        return this.handleResponse(response);
    }

    async UpdateStatusTypeAsync(id: number, updateStatusTypeModel: UpdateStatusTypeModel): Promise<StatusTypeModel> {
        const response = await this.restClient.Put<ApiResponse<StatusTypeModel>>(`/status-types/${id}`, { payload: updateStatusTypeModel });
        return this.handleResponse(response);
    }

    async DeleteStatusTypeAsync(id: number): Promise<void> {
        const response = await this.restClient.Post<ApiResponse<null>>(`/status-types/delete${id}`, {});
        await this.handleResponse(response);
    }

    async GetAllStatusTypesAsync(): Promise<StatusTypeModel[]> {
        const response = await this.restClient.Get<ApiResponse<StatusTypeModel[]>>("/status-types/all");
        return this.handleResponse(response);
    }

    async GetAllStatusTypesPagedAsync(params: GetAllStatusTypePagedParams): Promise<PagedList<StatusTypeModel>> {
        const response = await this.restClient.Get<ApiResponse<PagedList<StatusTypeModel>>>(`/status-types`, {
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                search: params.search || "",
                column: params.column || "createdAt",
                direction: params.direction || "asc",
            },
        });
        return this.handleResponse(response);
    }
}

export default StatusTypeService;
