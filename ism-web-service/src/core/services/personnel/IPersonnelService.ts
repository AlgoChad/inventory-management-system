import {
    PersonnelModel,
    CreatePersonnelModel,
    UpdatePersonnelModel,
    PersonnelResult,
    GetAllPersonnelPagedParams,
} from "@/src/data/models/personnel/PersonnelModel";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

interface IPersonnelService {
    CreatePersonnelAsync(createPersonnelModel: CreatePersonnelModel): Promise<PersonnelResult>;
    GetPersonnelByIdAsync(id: number): Promise<PersonnelResult>;
    UpdatePersonnelAsync(id: number, updatePersonnelModel: UpdatePersonnelModel): Promise<PersonnelResult>;
    DeletePersonnelAsync(id: number): Promise<PersonnelResult>;
    GetAllPersonnelAsync(): Promise<PersonnelModel[]>;
    GetAllPersonnelPagedAsync(params: GetAllPersonnelPagedParams): Promise<PagedList<PersonnelModel>>;
}

export default IPersonnelService;
