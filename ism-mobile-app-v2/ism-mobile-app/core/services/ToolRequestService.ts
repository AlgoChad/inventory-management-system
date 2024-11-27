import RestClient from "@/data/rest/RestClient";
import { ApiResponse } from "@/data/models/generic/ApiModel";
import {
    ToolRequestModel,
    CreateToolRequestModel,
    ToolRequest,
    UpdateToolRequestModel,
    CreateToolRepairRequestModel,
    UpdateToolRepairRequestModel,
    ToolRepairRequestModel,
    ToolRepairRequest,
} from "@/data/models/tool/ToolModel";
import { PagedList } from "@/data/models/generic/PaginationModel";

const API_BASE_URL = "https://inventory-management-system-w58n.onrender.com/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class ToolRequestService {
    async getAllToolRequests(
        page: number = 1,
        limit: number = 10,
        search: string = "",
        column: string = "createdAt",
        direction: "asc" | "desc" = "desc"
    ): Promise<ApiResponse<PagedList<ToolRequest>>> {
        return await restClient.Get<ApiResponse<PagedList<ToolRequest>>>(
            `/tool-request/requests`,
            {
                page,
                limit,
                search,
                column,
                direction,
            }
        );
    }

    async updateToolRequest(id: number, data: UpdateToolRequestModel): Promise<ApiResponse<ToolRequestModel>> {
        return await restClient.Put<ApiResponse<ToolRequestModel>>(
            `/tool-request/update-request/${id}`,
            { payload: data }
        );
    }

    async createToolRequest(
        data: CreateToolRequestModel
    ): Promise<ApiResponse<ToolRequestModel>> {
        return await restClient.Post<ApiResponse<ToolRequestModel>>(
            "/tool-request/create-request",
            { payload: data }
        );
    }

    async getAllToolRepairRequests(
        page: number = 1,
        limit: number = 10,
        search: string = "",
        column: string = "createdAt",
        direction: "asc" | "desc" = "desc"
    ): Promise<ApiResponse<PagedList<ToolRepairRequest>>> {
        return await restClient.Get<ApiResponse<PagedList<ToolRepairRequest>>>(
            `/tool-request/repair-requests`,
            {
                page,
                limit,
                search,
                column,
                direction,
            }
        );
    }

    async updateToolRepairRequest(id: number, data: UpdateToolRepairRequestModel): Promise<ApiResponse<ToolRepairRequest>> {
        return await restClient.Put<ApiResponse<ToolRepairRequest>>(
            `/tool-request/update-repair-request/${id}`,
            { payload: data }
        );
    }

    async createToolRepairRequest(
        data: CreateToolRepairRequestModel
    ): Promise<ApiResponse<ToolRepairRequest>> {
        return await restClient.Post<ApiResponse<ToolRepairRequest>>(
            "/tool-request/create-repair-request",
            { payload: data }
        );
    }
}

export default new ToolRequestService();
