import RestClient from "~/data/rest/RestClient"; // Adjust the import path as needed
import {
    ProjectModel,
    CreateProjectModel,
    UpdateProjectModel,
    GetAllProjectPagedParams,
} from "~/data/models/project/ProjectModel";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { StatusTypeModel } from "~/data/models/status-type/StatusTypeModel";
import PersonnelService from "./PersonnelService";
import ConditionTypeService from "./ConditionTypeService";
import StatusTypeService from "./StatusTypeService";
import { Datatable } from "~/data/models/generic/DatatableModel";

const API_BASE_URL = "https://a04e-158-62-42-150.ngrok-free.app/api";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

const restClient = new RestClient(API_BASE_URL, API_TOKEN);

class ProjectService {
    private personnelService = PersonnelService;
    private conditionTypeService = ConditionTypeService;
    private statusTypeService = StatusTypeService;

    async createProject(data: CreateProjectModel): Promise<ApiResponse<ProjectModel>> {
        return await restClient.Post<ApiResponse<ProjectModel>>('/projects', { payload: data });
    }

    async getProjectById(id: number): Promise<ApiResponse<ProjectModel>> {
        return await restClient.Get<ApiResponse<ProjectModel>>(`/projects/${id}`);
    }

    async updateProject(id: number, data: UpdateProjectModel): Promise<ApiResponse<ProjectModel>> {
        return await restClient.Put<ApiResponse<ProjectModel>>(`/projects/${id}`, { payload: data });
    }

    async deleteProject(id: number): Promise<ApiResponse<null>> {
        return await restClient.Post<ApiResponse<null>>(`/projects/delete/${id}`, {});
    }

    async getAllProjects(): Promise<ApiResponse<ProjectModel[]>> {
        return await restClient.Get<ApiResponse<ProjectModel[]>>('/projects/all');
    }

    async getAllProjectsPaged(params: GetAllProjectPagedParams): Promise<ApiResponse<PagedList<ProjectModel>>> {
        return await restClient.Get<ApiResponse<PagedList<ProjectModel>>>('/projects', params);
    }

    async getProjectPageData(params: GetAllProjectPagedParams): Promise<{
        projects: Datatable<ProjectModel>;
        personnel: PersonnelModel[];
        conditionTypes: ConditionTypeModel[];
        statusTypes: StatusTypeModel[];
    }> {
        const [projects, personnel, conditionTypes, statusTypes] = await Promise.all([
            this.getAllProjectsPaged(params),
            this.personnelService.getAllPersonnel(),
            this.conditionTypeService.getAllConditionTypes(),
            this.statusTypeService.getAllStatusTypes(),
        ]);

        const personnelList: PersonnelModel[] = personnel.data ? personnel.data : [];
        const conditionTypesList: ConditionTypeModel[] = conditionTypes.data ? conditionTypes.data : [];
        const statusTypesList: StatusTypeModel[] = statusTypes.data ? statusTypes.data : [];

        const projectsTable: Datatable<ProjectModel> = {
            data: projects.data ? projects.data.list : [],
            pagination: {
                page: projects.data ? projects.data.pagination.currentPage : 0,
                length: projects.data ? projects.data.pagination.pageSize : 0,
                totalCount: projects.data ? projects.data.pagination.totalItems : 0,
            },
            defaultSort: {
                id: "createdAt",
                desc: "asc",
            },
        };

        return { projects: projectsTable, personnel: personnelList, conditionTypes: conditionTypesList, statusTypes: statusTypesList };
    }
}

export default new ProjectService();
