import {
    ToolModel,
    CreateToolModel,
    UpdateToolModel,
    GetAllToolPagedParams,
} from "@/app/data/models/tool/ToolModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { StatusTypeModel } from "~/data/models/status-type/StatusTypeModel";
import { Datatable } from "~/data/models/generic/DatatableModel";

export default interface IToolService {
    CreateToolAsync(createToolModel: CreateToolModel): Promise<ToolModel>;
    GetToolByIdAsync(id: number): Promise<ToolModel>;
    UpdateToolAsync(
        id: number,
        updateToolModel: UpdateToolModel
    ): Promise<ToolModel>;
    DeleteToolAsync(id: number): Promise<ApiResponse<null>>;
    GetAllToolsAsync(): Promise<ToolModel[]>;
    GetAllToolsPagedAsync(
        params: GetAllToolPagedParams
    ): Promise<PagedList<ToolModel>>;
    GetToolPageDataAsync(
        params: GetAllToolPagedParams
    ): Promise<{
        tools: Datatable<ToolModel>;
        personnel: PersonnelModel[];
        conditionTypes: ConditionTypeModel[];
        statusTypes: StatusTypeModel[];
    }>;
}
