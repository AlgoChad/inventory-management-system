
import { ToolModel, CreateToolModel, UpdateToolModel, ToolResult, GetAllToolPagedParams } from "@/app/data/models/tool/ToolModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";

export default interface IToolService {
  CreateToolAsync(createToolModel: CreateToolModel): Promise<ToolResult>;
  GetToolByIdAsync(id: number): Promise<ToolResult>;
  UpdateToolAsync(id: number, updateToolModel: UpdateToolModel): Promise<ToolResult>;
  DeleteToolAsync(id: number): Promise<ToolResult>;
  GetAllToolsAsync(): Promise<ToolModel[]>;
  GetAllToolsPagedAsync(params: GetAllToolPagedParams): Promise<PagedList<ToolModel>>;
}
