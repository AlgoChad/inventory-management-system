import RestClient from "@/data/rest/RestClient";
import {
    ToolModel,
    CreateToolModel,
    UpdateToolModel,
    GetAllToolPagedParams,
} from "@/data/models/tool/ToolModel";
import { ApiResponse } from "@/data/models/generic/ApiModel";
import { PagedList } from "@/data/models/generic/PaginationModel";
import { PersonnelModel } from "@/data/models/personnel/PersonnelModel";
import { ConditionTypeModel } from "@/data/models/condition-type/ConditionTypeModel";
import { StatusTypeModel } from "@/data/models/status-type/StatusTypeModel";
import PersonnelService from "./PersonnelService";
import ConditionTypeService from "./ConditionTypeService";
import StatusTypeService from "./StatusTypeService";
import { Datatable } from "@/data/models/generic/DatatableModel";

const API_BASE_URL = "https://inventory-management-system-w58n.onrender.com/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class ToolService {
    private personnelService: typeof PersonnelService;
    private conditionTypeService: typeof ConditionTypeService;
    private statusTypeService: typeof StatusTypeService;

    constructor() {
        this.personnelService = PersonnelService;
        this.conditionTypeService = ConditionTypeService;
        this.statusTypeService = StatusTypeService;
    }

    async createTool(data: CreateToolModel): Promise<ApiResponse<ToolModel>> {
        return await restClient.Post<ApiResponse<ToolModel>>('/tools', { payload: data });
    }

    async getToolById(id: number): Promise<ApiResponse<ToolModel>> {
        return await restClient.Get<ApiResponse<ToolModel>>(`/tools/${id}`);
    }

    async updateTool(id: number, data: UpdateToolModel): Promise<ApiResponse<ToolModel>> {
        return await restClient.Put<ApiResponse<ToolModel>>(`/tools/${id}`, { payload: data });
    }

    async deleteTool(id: number): Promise<ApiResponse<null>> {
        return await restClient.Post<ApiResponse<null>>(`/tools/delete/${id}`, {});
    }

    async getAllTools(): Promise<ApiResponse<ToolModel[]>> {
        return await restClient.Get<ApiResponse<ToolModel[]>>('/tools/all');
    }

    async getAllToolsPaged(params: GetAllToolPagedParams): Promise<ApiResponse<PagedList<ToolModel>>> {
        return await restClient.Get<ApiResponse<PagedList<ToolModel>>>('/tools', params);
    }

    async getToolPageData(params: GetAllToolPagedParams): Promise<{
        tools: Datatable<ToolModel>;
        personnel: PersonnelModel[];
        conditionTypes: ConditionTypeModel[];
        statusTypes: StatusTypeModel[];
    }> {
        const [tools, personnel, conditionTypes, statusTypes] = await Promise.all([
            this.getAllToolsPaged(params),
            this.personnelService.getAllPersonnel(),
            this.conditionTypeService.getAllConditionTypes(),
            this.statusTypeService.getAllStatusTypes(),
        ]);

        const personelList: PersonnelModel[] = personnel.data ? personnel.data : [];
        const conditionTypesList: ConditionTypeModel[] = conditionTypes.data ? conditionTypes.data : [];
        const statusTypesList: StatusTypeModel[] = statusTypes.data ? statusTypes.data : [];

        const toolsTable: Datatable<ToolModel> = {
            data: tools.data ? tools.data.list : [],
            pagination: {
                page: tools.data ? tools.data.pagination.currentPage : 0,
                length: tools.data ? tools.data.pagination.pageSize : 0,
                totalCount: tools.data ? tools.data.pagination.totalItems : 0,
            },
            defaultSort: {
                id: "createdAt",
                desc: "asc",
            },
        };

        return { tools: toolsTable, personnel: personelList, conditionTypes: conditionTypesList, statusTypes: statusTypesList };
    }
}

export default new ToolService();
