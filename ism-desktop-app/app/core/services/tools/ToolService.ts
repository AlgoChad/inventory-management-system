import { ToolModel, CreateToolModel, UpdateToolModel, ToolResult, GetAllToolPagedParams } from "@/app/data/models/tool/ToolModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";
import { ApiResponse } from "@/app/data/models/generic/ApiModel";
import RestClient from "@/app/data/rest/RestClient";
import IToolService from "./IToolService";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;

class ToolService implements IToolService {
  private restClient: RestClient;

  constructor() {
    this.restClient = new RestClient(API_BASE_URL, API_TOKEN);
  }

  private async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
    if (response && response.data) {
      return response.data;
    }
    throw new Error("Invalid response from server");
  }

  async CreateToolAsync(createToolModel: CreateToolModel): Promise<ToolResult> {
    const response = await this.restClient.Post<ApiResponse<ToolResult>>("/tools", { payload: createToolModel });
    return this.handleResponse(response);
  }

  async GetToolByIdAsync(id: number): Promise<ToolResult> {
    const response = await this.restClient.Get<ApiResponse<ToolResult>>(`/tools/${id}`);
    return this.handleResponse(response);
  }

  async UpdateToolAsync(id: number, updateToolModel: UpdateToolModel): Promise<ToolResult> {
    const response = await this.restClient.Put<ApiResponse<ToolResult>>(`/tools/${id}`, { payload: updateToolModel });
    return this.handleResponse(response);
  }

  async DeleteToolAsync(id: number): Promise<ToolResult> {
    const response = await this.restClient.Post<ApiResponse<ToolResult>>(`/tools/${id}`, {});
    return this.handleResponse(response);
  }

  async GetAllToolsAsync(): Promise<ToolModel[]> {
    const response = await this.restClient.Get<ApiResponse<ToolModel[]>>("/tools");
    return this.handleResponse(response);
  }

  async GetAllToolsPagedAsync(params: GetAllToolPagedParams): Promise<PagedList<ToolModel>> {
    const response = await this.restClient.Get<ApiResponse<PagedList<ToolModel>>>(`/tools`, {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || "",
        column: params.column || "createdAt",
        direction: params.direction || "asc",
    });
    return this.handleResponse(response);
  }
}

export default ToolService;
