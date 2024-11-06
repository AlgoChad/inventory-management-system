import { 
    ConditionTypeModel, 
    CreateConditionTypeModel, 
    UpdateConditionTypeModel, 
    GetAllConditionTypePagedParams 
} from "@/app/data/models/condition-type/ConditionTypeModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";
import { ApiResponse } from "@/app/data/models/generic/ApiModel";
import RestClient from "@/app/data/rest/RestClient";
import IConditionTypeService from "./IConditionTypeService";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;

class ConditionTypeService implements IConditionTypeService {
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

    async CreateConditionTypeAsync(createConditionTypeModel: CreateConditionTypeModel): Promise<ConditionTypeModel> {
        const response = await this.restClient.Post<ApiResponse<ConditionTypeModel>>("/condition-types", { payload: createConditionTypeModel });
        return this.handleResponse(response);
    }

    async GetConditionTypeByIdAsync(id: number): Promise<ConditionTypeModel> {
        const response = await this.restClient.Get<ApiResponse<ConditionTypeModel>>(`/condition-types/${id}`);
        return this.handleResponse(response);
    }

    async UpdateConditionTypeAsync(id: number, updateConditionTypeModel: UpdateConditionTypeModel): Promise<ConditionTypeModel> {
        const response = await this.restClient.Put<ApiResponse<ConditionTypeModel>>(`/condition-types/${id}`, { payload: updateConditionTypeModel });
        return this.handleResponse(response);
    }

    async DeleteConditionTypeAsync(id: number): Promise<void> {
        const response = await this.restClient.Post<ApiResponse<null>>(`/condition-types/delete/${id}`, {});
        await this.handleResponse(response);
    }

    async GetAllConditionTypesAsync(): Promise<ConditionTypeModel[]> {
        const response = await this.restClient.Get<ApiResponse<ConditionTypeModel[]>>("/condition-types/all");
        return this.handleResponse(response);
    }

    async GetAllConditionTypesPagedAsync(params: GetAllConditionTypePagedParams): Promise<PagedList<ConditionTypeModel>> {
        const response = await this.restClient.Get<ApiResponse<PagedList<ConditionTypeModel>>>(`/condition-types`, {
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

export default ConditionTypeService;
