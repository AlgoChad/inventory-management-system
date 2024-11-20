import { PagedList } from "@/src/data/models/generic/PaginationModel";
import {
    RequestResult,
    CreateToolRequestModel,
    UpdateToolRequestModel,
    CreateToolRepairRequestModel,
    UpdateToolRepairRequestModel,
    ToolRequest,
    ToolRepairRequest,
} from "@/src/data/models/tool/ToolModel";

export default interface IToolRequestService {
    GetAllToolsRequestPagedAsync(params: any): Promise<PagedList<ToolRequest>>;
    GetAllToolsRepairRequestPagedAsync(params: any): Promise<PagedList<ToolRepairRequest>>;
    GetToolRequestByIdAsync(id: number): Promise<ToolRequest | null>;
    GetToolRepairRequestByIdAsync(id: number): Promise<ToolRepairRequest | null>;
    CreateToolRequestAsync(toolRequestModel: CreateToolRequestModel): Promise<RequestResult>;
    CreateToolRepairRequestAsync(toolRepairRequestModel: CreateToolRepairRequestModel): Promise<RequestResult>;
    UpdateToolRequestAsync(id: number, toolRequestModel: UpdateToolRequestModel): Promise<RequestResult>;
    UpdateToolRepairRequestAsync(id: number, toolRepairRequestModel: UpdateToolRepairRequestModel): Promise<RequestResult>;
    DeleteToolRequestAsync(id: number): Promise<RequestResult>;
    DeleteToolRepairRequestAsync(id: number): Promise<RequestResult>;
}
