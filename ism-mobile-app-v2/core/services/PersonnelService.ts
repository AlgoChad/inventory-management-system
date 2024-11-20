import { 
    PersonnelModel, 
    CreatePersonnelModel, 
    UpdatePersonnelModel, 
    GetAllPersonnelPagedParams 
} from "~/data/models/personnel/PersonnelModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = "https://a04e-158-62-42-150.ngrok-free.app/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class PersonnelService {
    private restClient: RestClient;

    constructor() {
        this.restClient = new RestClient(API_BASE_URL, API_TOKEN);
    }

    async createPersonnel(data: CreatePersonnelModel): Promise<ApiResponse<PersonnelModel>> {
        return await this.restClient.Post<ApiResponse<PersonnelModel>>("/personnel", { payload: data });
    }

    async getPersonnelById(id: number): Promise<ApiResponse<PersonnelModel>> {
        return await this.restClient.Get<ApiResponse<PersonnelModel>>(`/personnel/${id}`);
    }

    async updatePersonnel(id: number, data: UpdatePersonnelModel): Promise<ApiResponse<PersonnelModel>> {
        return await this.restClient.Put<ApiResponse<PersonnelModel>>(`/personnel/${id}`, { payload: data });
    }

    async deletePersonnel(id: number): Promise<ApiResponse<null>> {
        return await this.restClient.Post<ApiResponse<null>>(`/personnel/delete/${id}`, {});
    }

    async getAllPersonnel(): Promise<ApiResponse<PersonnelModel[]>> {
        return await this.restClient.Get<ApiResponse<PersonnelModel[]>>("/personnel/all");
    }

    async getAllPersonnelPaged(params: GetAllPersonnelPagedParams): Promise<ApiResponse<PagedList<PersonnelModel>>> {
        return await this.restClient.Get<ApiResponse<PagedList<PersonnelModel>>>(`/personnel`, {
            params: {
                page: params.page || 1,
                limit: params.limit || 10,
                search: params.search || "",
                column: params.column || "createdAt",
                direction: params.direction || "asc",
            },
        });
    }
}

export default new PersonnelService();
