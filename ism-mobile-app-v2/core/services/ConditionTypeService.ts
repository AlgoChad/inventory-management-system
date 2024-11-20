import {
    ConditionTypeModel,
    CreateConditionTypeModel,
    UpdateConditionTypeModel,
    GetAllConditionTypePagedParams,
} from "~/data/models/condition-type/ConditionTypeModel";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = "https://a04e-158-62-42-150.ngrok-free.app/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class ConditionTypeService {
    async getAllConditionTypesPaged(params: any): Promise<ApiResponse<PagedList<ConditionTypeModel>>> {
        return await restClient.Get<ApiResponse<PagedList<ConditionTypeModel>>>('/condition-types', params);
    }

    async getAllConditionTypes(): Promise<ApiResponse<ConditionTypeModel[]>> {
        return await restClient.Get<ApiResponse<ConditionTypeModel[]>>('/condition-types/all');
    }

    async getConditionTypeById(id: number): Promise<ApiResponse<ConditionTypeModel>> {
        return await restClient.Get<ApiResponse<ConditionTypeModel>>(`/condition-types/${id}`);
    }

    async createConditionType(data: CreateConditionTypeModel): Promise<ApiResponse<ConditionTypeModel>> {
        return await restClient.Post<ApiResponse<ConditionTypeModel>>('/condition-types', {payload: data });
    }

    async updateConditionType(id: number, data: UpdateConditionTypeModel): Promise<ApiResponse<ConditionTypeModel>> {
        return await restClient.Put<ApiResponse<ConditionTypeModel>>(`/condition-types/${id}`, {payload: data});
    }

    async deleteConditionType(id: number): Promise<ApiResponse<null>> {
        return await restClient.Post<ApiResponse<null>>(`/condition-types/delete/${id}`, {});
    }
}

export default new ConditionTypeService();
