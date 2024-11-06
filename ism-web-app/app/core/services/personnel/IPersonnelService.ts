import { 
    PersonnelModel, 
    CreatePersonnelModel, 
    UpdatePersonnelModel, 
    GetAllPersonnelPagedParams
} from "@/app/data/models/personnel/PersonnelModel";
import { PagedList } from "@/app/data/models/generic/PaginationModel";

export default interface IPersonnelService {
    CreatePersonnelAsync(createPersonnelModel: CreatePersonnelModel): Promise<PersonnelModel>;
    GetPersonnelByIdAsync(id: number): Promise<PersonnelModel>;
    UpdatePersonnelAsync(id: number, updatePersonnelModel: UpdatePersonnelModel): Promise<PersonnelModel>;
    DeletePersonnelAsync(id: number): Promise<void>;
    GetAllPersonnelAsync(): Promise<PersonnelModel[]>;
    GetAllPersonnelPagedAsync(params: GetAllPersonnelPagedParams): Promise<PagedList<PersonnelModel>>;
}
