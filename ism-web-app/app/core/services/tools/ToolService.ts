import {
    CreateToolModel,
    UpdateToolModel,
    ToolModel,
    GetAllToolPagedParams,
} from "@/app/data/models/tool/ToolModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";
import { ApiResponse } from "@/app/data/models/generic/ApiModel";
import RestClient from "@/app/data/rest/RestClient";
import IToolService from "./IToolService";
import IPersonnelService from "../personnel/IPersonnelService";
import IConditionTypeService from "../condition-type/IConditionTypeService";
import IStatusTypeService from "../status-type/IStatusTypeService";
import PersonnelService from "../personnel/PersonnelService";
import ConditionTypeService from "../condition-type/ConditionTypeService";
import StatusTypeService from "../status-type/StatusTypeService";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { StatusTypeModel } from "~/data/models/status-type/StatusTypeModel";
import { Datatable } from "~/data/models/generic/DatatableModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;

class ToolService implements IToolService {
    private restClient: RestClient;
    private personnelService: IPersonnelService;
    private conditionTypeService: IConditionTypeService;
    private statusTypeService: IStatusTypeService;

    constructor() {
        this.restClient = new RestClient(API_BASE_URL, API_TOKEN);
        this.personnelService = new PersonnelService();
        this.conditionTypeService = new ConditionTypeService();
        this.statusTypeService = new StatusTypeService();
    }

    private async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
        if (response.status) {
            return response.data as T;
        }
        throw new Error("Invalid response from server");
    }

    async CreateToolAsync(
        createToolModel: CreateToolModel
    ): Promise<ToolModel> {
        const response = await this.restClient.Post<ApiResponse<ToolModel>>(
            "/tools",
            { payload: createToolModel }
        );
        return this.handleResponse(response);
    }

    async GetToolByIdAsync(id: number): Promise<ToolModel> {
        const response = await this.restClient.Get<ApiResponse<ToolModel>>(
            `/tools/${id}`
        );
        return this.handleResponse(response);
    }

    async UpdateToolAsync(
        id: number,
        updateToolModel: UpdateToolModel
    ): Promise<ToolModel> {
        const response = await this.restClient.Put<ApiResponse<ToolModel>>(
            `/tools/${id}`,
            { payload: updateToolModel }
        );
        return this.handleResponse(response);
    }

    async DeleteToolAsync(id: number): Promise<ApiResponse<null>> {
        const response = await this.restClient.Post<ApiResponse<null>>(
            `/tools/delete/${id}`,
            {}
        );
        return response;
    }

    async GetAllToolsAsync(): Promise<ToolModel[]> {
        const response = await this.restClient.Get<ApiResponse<ToolModel[]>>(
            "/tools/all"
        );
        return this.handleResponse(response);
    }

    async GetAllToolsPagedAsync(
        params: GetAllToolPagedParams
    ): Promise<PagedList<ToolModel>> {
        const response = await this.restClient.Get<
            ApiResponse<PagedList<ToolModel>>
        >(`/tools`, {
            page: params.page || 1,
            limit: params.limit || 10,
            search: params.search || "",
            column: params.column || "createdAt",
            direction: params.direction || "asc",
        });
        return this.handleResponse(response);
    }

    async GetToolPageDataAsync(
        params: GetAllToolPagedParams
    ): Promise<{
        tools: Datatable<ToolModel>;
        personnel: PersonnelModel[];
        conditionTypes: ConditionTypeModel[];
        statusTypes: StatusTypeModel[];
    }> {
        const [tools, personnel, conditionTypes, statusTypes] = await Promise.all([
            this.GetAllToolsPagedAsync(params),
            this.personnelService.GetAllPersonnelAsync(),
            this.conditionTypeService.GetAllConditionTypesAsync(),
            this.statusTypeService.GetAllStatusTypesAsync(),
        ]);

        const toolsTable: Datatable<ToolModel> = {
            data: tools.list,
            pagination: {
                page: tools.pagination.currentPage,
                length: tools.pagination.pageSize,
                totalCount: tools.pagination.totalItems,
            },
            defaultSort: {
                id: "createdAt",
                desc: "asc",
            },
        };

        return { tools: toolsTable, personnel, conditionTypes, statusTypes };
    }
}

export default ToolService;
