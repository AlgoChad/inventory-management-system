import RestClient from "@/data/rest/RestClient"; // Adjust the import path as needed
import {
    CheckinModel,
    CreateCheckinModel,
    UpdateCheckinModel,
    GetAllCheckinPagedParams,
} from "@/data/models/checkin/CheckinModel";
import { ApiResponse } from "@/data/models/generic/ApiModel";
import { PagedList } from "@/data/models/generic/PaginationModel";
import { PersonnelModel } from "@/data/models/personnel/PersonnelModel";
import { ConditionTypeModel } from "@/data/models/condition-type/ConditionTypeModel";
import { StatusTypeModel } from "@/data/models/status-type/StatusTypeModel";
import PersonnelService from "./PersonnelService";
import ConditionTypeService from "./ConditionTypeService";
import StatusTypeService from "./StatusTypeService";
import ToolService from "./ToolService";
import { Datatable } from "@/data/models/generic/DatatableModel";
import { ToolModel } from "@/data/models/tool/ToolModel";
import { ProjectModel } from "@/data/models/project/ProjectModel";

const API_BASE_URL = "https://inventory-management-system-w58n.onrender.com/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class CheckinService {
    private personnelService = PersonnelService;
    private conditionTypeService = ConditionTypeService;
    private statusTypeService = StatusTypeService;
    private toolService = ToolService;

    async createCheckin(data: CreateCheckinModel): Promise<ApiResponse<CheckinModel>> {
        const response = await restClient.Post<ApiResponse<CheckinModel>>('/checkins', { payload: data });

        if (response.status !== "success") {
            throw new Error("Failed to create check-in");
        }

        const toolResult = await this.toolService.getToolById(data.toolId);

        if (toolResult.status !== "success") {
            throw new Error("Failed to fetch tool data");
        }

        const tool = toolResult.data;

        if (!tool) {
            throw new Error("Tool data is undefined");
        }

        const updatedTool = {
            quantity: tool.quantity - data.checkInQuantity,
        };

        const updateToolResponse = await this.toolService.updateTool(data.toolId, updatedTool);

        if (updateToolResponse.status !== "success") {
            throw new Error("Failed to update tool quantity");
        }

        return response;
    }

    async getCheckinById(id: number): Promise<ApiResponse<CheckinModel>> {
        return await restClient.Get<ApiResponse<CheckinModel>>(`/checkins/${id}`);
    }

    async updateCheckin(id: number, data: UpdateCheckinModel): Promise<ApiResponse<CheckinModel>> {
        if (data.toolId === undefined) {
            throw new Error("Tool ID is undefined");
        }

        const currentCheckinResponse = await this.getCheckinById(id);
        if (currentCheckinResponse.status !== "success" || !currentCheckinResponse.data) {
            throw new Error("Failed to fetch current check-in details");
        }
    
        const { checkInQuantity: previousCheckInQuantity, toolId: previousToolId } = currentCheckinResponse.data;
        const newCheckInQuantity = data.checkInQuantity;
        if (newCheckInQuantity === undefined) {
            throw new Error("New check-in quantity is undefined");
        }
    
        const quantityDifference = newCheckInQuantity - previousCheckInQuantity;
    
        const previousToolResponse = await this.toolService.getToolById(previousToolId);
        if (previousToolResponse.status !== "success" || !previousToolResponse.data) {
            throw new Error("Failed to fetch previous tool details");
        }
    
        const newToolResponse = await this.toolService.getToolById(data.toolId);
        if (newToolResponse.status !== "success" || !newToolResponse.data) {
            throw new Error("Failed to fetch new tool details");
        }
    
        const updateToolQuantity = async (toolId: number, quantity: number) => {
            const response = await this.toolService.updateTool(toolId, { quantity });
            if (response.status !== "success") {
                throw new Error("Failed to update tool quantity");
            }
        };
    
        if (previousToolId !== data.toolId) {
            if (data.toolId !== undefined) 
            await updateToolQuantity(previousToolId, previousToolResponse.data.quantity + previousCheckInQuantity);
            await updateToolQuantity(data.toolId, newToolResponse.data.quantity - newCheckInQuantity);
        } else {
            await updateToolQuantity(data.toolId, newToolResponse.data.quantity - quantityDifference);
        }
    
        const newProjectResponse = await restClient.Get<ApiResponse<ProjectModel>>(`/projects/${data.projectId}`);
        const updateCheckinModel: UpdateCheckinModel = {
            ...data,
            checkInColor: newProjectResponse.data?.color || "",
        };
    
        return await restClient.Put<ApiResponse<CheckinModel>>(`/checkins/${id}`, { payload: updateCheckinModel });
    }

    async deleteCheckin(id: number): Promise<ApiResponse<null>> {
        const currentCheckinResponse: ApiResponse<CheckinModel> = await this.getCheckinById(id);

        if (currentCheckinResponse.status !== "success") {
            throw new Error("Failed to fetch current check-in details");
        }

        if (!currentCheckinResponse.data) {
            throw new Error("Check-in data is undefined");
        }
        const quantityToReturn = currentCheckinResponse.data.checkInQuantity;
        const updateToolResponse: ApiResponse<ToolModel> = await this.toolService.updateTool(currentCheckinResponse.data.toolId, {
            quantity: quantityToReturn,
        });

        if (updateToolResponse.status !== "success") {
            throw new Error("Failed to update tool quantity");
        }

        return await restClient.Post<ApiResponse<null>>(`/checkins/delete/${id}`, {});
    }

    async transferCheckin(checkInId: number, projectId: number, transferQuantity: number): Promise<ApiResponse<CheckinModel>> {
        const checkInResponse = await this.getCheckinById(checkInId);
        if (checkInResponse.status !== "success" || !checkInResponse.data) {
            throw new Error("Failed to fetch check-in details");
        }

        const currentCheckin = checkInResponse.data;
        const currentQuantity = currentCheckin.checkInQuantity;

        if (transferQuantity === currentQuantity) {
            await this.deleteCheckin(checkInId);
        } else {
            const updatedQuantity = currentQuantity - transferQuantity;
            const updateCheckinModel: UpdateCheckinModel = {
                checkInQuantity: updatedQuantity,
            };
            await this.updateCheckin(checkInId, updateCheckinModel);
        }

        const createCheckinModel: CreateCheckinModel = {
            toolId: currentCheckin.toolId,
            projectId: projectId,
            checkInDate: new Date(),
            checkInColor: currentCheckin.checkInColor,
            checkInQuantity: transferQuantity,
            tool: undefined,
            project: undefined
        };

        return await this.createCheckin(createCheckinModel);
    }

    async checkoutCheckin(id: number): Promise<ApiResponse<CheckinModel>> {
        const currentCheckinResponse = await this.getCheckinById(id);
        if (currentCheckinResponse.status !== "success" || !currentCheckinResponse.data) {
            throw new Error("Failed to fetch current check-in details");
        }

        const currentCheckin = currentCheckinResponse.data;
        const checkInQuantity = currentCheckin.checkInQuantity;
        const toolId = currentCheckin.toolId;

        const toolResponse = await this.toolService.getToolById(toolId);
        if (toolResponse.status !== "success" || !toolResponse.data) {
            throw new Error("Failed to fetch tool details");
        }

        const updatedToolQuantity = toolResponse.data.quantity + checkInQuantity;
        const updateToolResponse = await this.toolService.updateTool(toolId, { quantity: updatedToolQuantity });
        if (updateToolResponse.status !== "success") {
            throw new Error("Failed to update tool quantity");
        }

        const updateCheckinModel: UpdateCheckinModel = {
            checkOutDate: new Date(),
        };

        return await this.updateCheckin(id, updateCheckinModel);
    }

    async getAllCheckins(): Promise<ApiResponse<CheckinModel[]>> {
        return await restClient.Get<ApiResponse<CheckinModel[]>>('/checkins/all');
    }

    async getAllCheckinsPaged(params: GetAllCheckinPagedParams): Promise<ApiResponse<PagedList<CheckinModel>>> {
        return await restClient.Get<ApiResponse<PagedList<CheckinModel>>>('/checkins', params);
    }

    async getCheckinPageData(params: GetAllCheckinPagedParams): Promise<{
        checkins: Datatable<CheckinModel>;
        personnel: PersonnelModel[];
        conditionTypes: ConditionTypeModel[];
        statusTypes: StatusTypeModel[];
    }> {
        const [checkins, personnel, conditionTypes, statusTypes] = await Promise.all([
            this.getAllCheckinsPaged(params),
            this.personnelService.getAllPersonnel(),
            this.conditionTypeService.getAllConditionTypes(),
            this.statusTypeService.getAllStatusTypes(),
        ]);

        const personnelList: PersonnelModel[] = personnel.data ? personnel.data : [];
        const conditionTypesList: ConditionTypeModel[] = conditionTypes.data ? conditionTypes.data : [];
        const statusTypesList: StatusTypeModel[] = statusTypes.data ? statusTypes.data : [];

        const checkinsTable: Datatable<CheckinModel> = {
            data: checkins.data ? checkins.data.list : [],
            pagination: {
                page: checkins.data ? checkins.data.pagination.currentPage : 0,
                length: checkins.data ? checkins.data.pagination.pageSize : 0,
                totalCount: checkins.data ? checkins.data.pagination.totalItems : 0,
            },
            defaultSort: {
                id: "createdAt",
                desc: "asc",
            },
        };

        return { checkins: checkinsTable, personnel: personnelList, conditionTypes: conditionTypesList, statusTypes: statusTypesList };
    }
}

export default new CheckinService();
