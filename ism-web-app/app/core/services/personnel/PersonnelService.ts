import { 
    PersonnelModel, 
    CreatePersonnelModel, 
    UpdatePersonnelModel, 
    GetAllPersonnelPagedParams 
} from "@/app/data/models/personnel/PersonnelModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";
import { ApiResponse } from "@/app/data/models/generic/ApiModel";
import RestClient from "@/app/data/rest/RestClient";
import IPersonnelService from "./IPersonnelService";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;

class PersonnelService implements IPersonnelService {
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

    async CreatePersonnelAsync(createPersonnelModel: CreatePersonnelModel): Promise<PersonnelModel> {
        const response = await this.restClient.Post<ApiResponse<PersonnelModel>>("/personnel", { payload: createPersonnelModel });
        return this.handleResponse(response);
    }

    async GetPersonnelByIdAsync(id: number): Promise<PersonnelModel> {
        const response = await this.restClient.Get<ApiResponse<PersonnelModel>>(`/personnel/${id}`);
        return this.handleResponse(response);
    }

    async UpdatePersonnelAsync(id: number, updatePersonnelModel: UpdatePersonnelModel): Promise<PersonnelModel> {
        const response = await this.restClient.Put<ApiResponse<PersonnelModel>>(`/personnel/${id}`, { payload: updatePersonnelModel });
        return this.handleResponse(response);
    }

    async DeletePersonnelAsync(id: number): Promise<void> {
        const response = await this.restClient.Post<ApiResponse<null>>(`/personnel/delete${id}`, {});
        await this.handleResponse(response);
    }

    async GetAllPersonnelAsync(): Promise<PersonnelModel[]> {
        const response = await this.restClient.Get<ApiResponse<PersonnelModel[]>>("/personnel/all");
        return this.handleResponse(response);
    }

    async GetAllPersonnelPagedAsync(params: GetAllPersonnelPagedParams): Promise<PagedList<PersonnelModel>> {
        const response = await this.restClient.Get<ApiResponse<PagedList<PersonnelModel>>>(`/personnel`, {
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

export default PersonnelService;
