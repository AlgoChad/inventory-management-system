import { 
    StatusTypeModel, 
    CreateStatusTypeModel, 
    UpdateStatusTypeModel, 
    GetAllStatusTypePagedParams 
} from "@/app/data/models/status-type/StatusTypeModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";

export default interface IStatusTypeService {
    CreateStatusTypeAsync(createStatusTypeModel: CreateStatusTypeModel): Promise<StatusTypeModel>;
    GetStatusTypeByIdAsync(id: number): Promise<StatusTypeModel>;
    UpdateStatusTypeAsync(id: number, updateStatusTypeModel: UpdateStatusTypeModel): Promise<StatusTypeModel>;
    DeleteStatusTypeAsync(id: number): Promise<void>;
    GetAllStatusTypesAsync(): Promise<StatusTypeModel[]>;
    GetAllStatusTypesPagedAsync(params: GetAllStatusTypePagedParams): Promise<PagedList<StatusTypeModel>>;
}
