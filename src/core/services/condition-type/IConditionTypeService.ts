import { ConditionTypeModel, CreateConditionTypeModel, UpdateConditionTypeModel, ConditionTypeResult, GetAllConditionTypePagedParams } from "@/src/data/models/condition-type/ConditionTypeModel";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

export default interface IConditionTypeService {
  CreateConditionTypeAsync(createConditionTypeModel: CreateConditionTypeModel): Promise<ConditionTypeResult>;
  GetConditionTypeByIdAsync(id: number): Promise<ConditionTypeResult>;
  UpdateConditionTypeAsync(id: number, updateConditionTypeModel: UpdateConditionTypeModel): Promise<ConditionTypeResult>;
  DeleteConditionTypeAsync(id: number): Promise<ConditionTypeResult>;
  GetAllConditionTypesPagedAsync(params: GetAllConditionTypePagedParams): Promise<PagedList<ConditionTypeModel>>;
}
