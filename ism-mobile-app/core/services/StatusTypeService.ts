import RestClient from "@/data/rest/RestClient"; // Adjust the import path as needed
import {
    StatusTypeModel,
    CreateStatusTypeModel,
    UpdateStatusTypeModel,
    GetAllStatusTypePagedParams,
} from "@/data/models/status-type/StatusTypeModel";
import { ApiResponse } from "@/data/models/generic/ApiModel";
import { PagedList } from "@/data/models/generic/PaginationModel";

const API_BASE_URL = "http://192.168.254.104:3000/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTcyOTEyNjM3NCwiZXhwIjoxNzI5MTI3Mjc0fQ.PGNA3XLqt6oYc5m3POdlXncEutnY9irZofx8b8uYeDk";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class StatusTypeService {
    async getAllStatusTypesPaged(params: any): Promise<ApiResponse<PagedList<StatusTypeModel>>> {
        return await restClient.Get<ApiResponse<PagedList<StatusTypeModel>>>('/status-types', params);
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
