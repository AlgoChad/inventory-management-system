import {
    CheckinModel,
    CreateCheckinModel,
    UpdateCheckinModel,
    CheckinResult,
    GetAllCheckinPagedParams,
} from "@/src/data/models/checkin/CheckinModel";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

export default interface ICheckinService {
    CreateCheckinAsync(
        createCheckinModel: CreateCheckinModel
    ): Promise<CheckinResult>;
    GetCheckinByIdAsync(id: number): Promise<CheckinResult>;
    UpdateCheckinAsync(
        id: number,
        updateCheckinModel: UpdateCheckinModel
    ): Promise<CheckinResult>;
    DeleteCheckinAsync(id: number): Promise<CheckinResult>;
    GetAllCheckinsAsync(): Promise<CheckinModel[]>;
    GetAllCheckinsPagedAsync(
        params: GetAllCheckinPagedParams
    ): Promise<PagedList<CheckinModel>>;
}
