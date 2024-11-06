import { 
    ConditionTypeModel, 
    CreateConditionTypeModel, 
    UpdateConditionTypeModel, 
    GetAllConditionTypePagedParams 
} from "@/app/data/models/condition-type/ConditionTypeModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";

export default interface IConditionTypeService {
    CreateConditionTypeAsync(createConditionTypeModel: CreateConditionTypeModel): Promise<ConditionTypeModel>;
    GetConditionTypeByIdAsync(id: number): Promise<ConditionTypeModel>;
    UpdateConditionTypeAsync(id: number, updateConditionTypeModel: UpdateConditionTypeModel): Promise<ConditionTypeModel>;
    DeleteConditionTypeAsync(id: number): Promise<void>;
    GetAllConditionTypesAsync(): Promise<ConditionTypeModel[]>;
    GetAllConditionTypesPagedAsync(params: GetAllConditionTypePagedParams): Promise<PagedList<ConditionTypeModel>>;
}
