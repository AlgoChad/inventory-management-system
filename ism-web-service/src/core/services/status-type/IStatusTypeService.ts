import { StatusTypeModel, CreateStatusTypeModel, UpdateStatusTypeModel, StatusTypeResult, GetAllStatusTypePagedParams } from "@/src/data/models/status-type/StatusTypeModel";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

export default interface IStatusTypeService {
  CreateStatusTypeAsync(createStatusTypeModel: CreateStatusTypeModel): Promise<StatusTypeResult>;
  GetStatusTypeByIdAsync(id: number): Promise<StatusTypeResult>;
  UpdateStatusTypeAsync(id: number, updateStatusTypeModel: UpdateStatusTypeModel): Promise<StatusTypeResult>;
  DeleteStatusTypeAsync(id: number): Promise<StatusTypeResult>;
  GetAllStatusTypesPagedAsync(params: GetAllStatusTypePagedParams): Promise<PagedList<StatusTypeModel>>;
}
