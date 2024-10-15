import { ToolModel, CreateToolModel, UpdateToolModel, ToolResult, GetAllToolPagedParams } from "@/src/data/models/tool/ToolModel";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

export default interface IToolService {
  CreateToolAsync(createToolModel: CreateToolModel): Promise<ToolResult>;
  GetToolByIdAsync(id: number): Promise<ToolResult>;
  UpdateToolAsync(id: number, updateToolModel: UpdateToolModel): Promise<ToolResult>;
  DeleteToolAsync(id: number): Promise<ToolResult>;
  GetAllToolsPagedAsync(params: GetAllToolPagedParams): Promise<PagedList<ToolModel>>;
}
