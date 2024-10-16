import { PrismaClient } from "@prisma/client/extension";
import {
    PersonnelModel,
    CreatePersonnelModel,
    UpdatePersonnelModel,
    PersonnelResult,
    GetAllPersonnelPagedParams,
} from "@/src/data/models/personnel/PersonnelModel";
import IPersonnelService from "./IPersonnelService";
import PersonnelRepository from "@/src/data/repository/PersonnelRepository";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

class PersonnelService implements IPersonnelService {
    private readonly _repository: typeof PersonnelRepository;

    constructor() {
        this._repository = PersonnelRepository;
    }

    public async CreatePersonnelAsync(
        createPersonnelModel: CreatePersonnelModel
    ): Promise<PersonnelResult> {
        try {
            const personnel = await this._repository.InsertAsync(
                createPersonnelModel
            );
            return {
                isSuccess: true,
                message: "Personnel created successfully",
                personnel: personnel as PersonnelModel,
            };
        } catch (error) {
            console.error("Error creating personnel:", error);
            return {
                isSuccess: false,
                message: "Personnel creation failed",
            };
        }
    }

    public async GetPersonnelByIdAsync(
        id: number
    ): Promise<PersonnelResult> {
        try {
            const personnel = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                        include: {
                            tools: true,
                        },
                    });
                }
            );

            if (personnel) {
                return {
                    isSuccess: true,
                    message: "Personnel retrieved successfully",
                    personnel: personnel as PersonnelModel,
                };
            } else {
                return {
                    isSuccess: false,
                    message: "Personnel not found",
                };
            }
        } catch (error) {
            console.error("Error retrieving personnel:", error);
            return {
                isSuccess: false,
                message: "Personnel retrieval failed",
            };
        }
    }

    public async UpdatePersonnelAsync(
        id: number,
        updatePersonnelModel: UpdatePersonnelModel
    ): Promise<PersonnelResult> {
        try {
            const personnel = await this._repository.UpdateAsync({
                id,
                data: updatePersonnelModel,
            });

            return {
                isSuccess: true,
                message: "Personnel updated successfully",
                personnel: personnel as PersonnelModel,
            };
        } catch (error) {
            console.error("Error updating personnel:", error);
            return {
                isSuccess: false,
                message: "Personnel update failed",
            };
        }
    }

    public async DeletePersonnelAsync(
        id: number
    ): Promise<PersonnelResult> {
        try {
            const personnelResult = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                    });
                }
            );

            if (!personnelResult) {
                return {
                    isSuccess: false,
                    message: "Personnel not found",
                };
            }

            await this._repository.DeleteAsync(personnelResult);

            return {
                isSuccess: true,
                message: "Personnel deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting personnel:", error);
            return {
                isSuccess: false,
                message: "Personnel deletion failed",
            };
        }
    }

    public async GetAllPersonnelAsync(): Promise<PersonnelModel[]> {
        try {
            const personnel = await this._repository.GetAllAsync(
                async (query: PrismaClient) => {
                    const result = await query.findMany();

                    return result;
                }
            );

            return personnel as PersonnelModel[];
        } catch (error) {
            console.error("Error retrieving personnel:", error);
            throw new Error("Personnel retrieval failed");
        }
    }

    public async GetAllPersonnelPagedAsync(
        params: GetAllPersonnelPagedParams
    ): Promise<PagedList<PersonnelModel>> {
        const { page, limit, search, column, direction } = params;
        try {
            const result = await this._repository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const orderBy: { [key: string]: 'asc' | 'desc' } = {};

                    if (column && direction) {
                        orderBy[column] = direction;
                    }
            
                    const result = await query.findMany({
                        include: {
                            Tool: true,
                        },
                        orderBy: orderBy,
                    });
            
                    return result;
                }, page, limit
            );

            return result as PagedList<PersonnelModel>;
        } catch (error) {
            console.error("Error retrieving personnel:", error);
            throw new Error("Personnel retrieval failed");
        }
    }
}

export default PersonnelService;
