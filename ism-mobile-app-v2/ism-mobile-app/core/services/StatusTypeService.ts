import RestClient from "@/data/rest/RestClient"; // Adjust the import path as needed
import {
    StatusTypeModel,
    CreateStatusTypeModel,
    UpdateStatusTypeModel,
    GetAllStatusTypePagedParams,
} from "@/data/models/status-type/StatusTypeModel";
import { ApiResponse } from "@/data/models/generic/ApiModel";
import { PagedList } from "@/data/models/generic/PaginationModel";

const API_BASE_URL = "https://inventory-management-system-w58n.onrender.com/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class StatusTypeService {
    async getAllStatusTypesPaged(params: any): Promise<ApiResponse<PagedList<StatusTypeModel>>> {
        return await restClient.Get<ApiResponse<PagedList<StatusTypeModel>>>('/status-types', params);
    }

    async getAllStatusTypes(): Promise<ApiResponse<StatusTypeModel[]>> {
        return await restClient.Get<ApiResponse<StatusTypeModel[]>>('/status-types/all');
    }

    async createStatusType(data: CreateStatusTypeModel): Promise<ApiResponse<StatusTypeModel>> {
        return await restClient.Post<ApiResponse<StatusTypeModel>>('/status-types', {payload: data});
    }

    async updateStatusType(id: number, data: UpdateStatusTypeModel): Promise<ApiResponse<StatusTypeModel>> {
        return await restClient.Put<ApiResponse<StatusTypeModel>>(`/status-types/${id}`, {payload: { name: data.name, id: id }});
    }

    async deleteStatusType(id: number): Promise<ApiResponse<null>> {
        return await restClient.Post<ApiResponse<null>>(`/status-types/delete/${id}`, {});
    }
}

export default new StatusTypeService();
