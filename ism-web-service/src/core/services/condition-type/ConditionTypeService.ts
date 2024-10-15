import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import {
    ConditionTypeModel,
    CreateConditionTypeModel,
    UpdateConditionTypeModel,
    ConditionTypeResult,
    GetAllConditionTypePagedParams,
} from "@/src/data/models/condition-type/ConditionTypeModel";
import IConditionTypeService from "./IConditionTypeService";
import ConditionTypeRepository from "@/src/data/repository/ConditionTypeRepository";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

class ConditionTypeService implements IConditionTypeService {
    private readonly _repository: typeof ConditionTypeRepository;

    constructor() {
        this._repository = ConditionTypeRepository;
    }

    public async CreateConditionTypeAsync(
        createConditionTypeModel: CreateConditionTypeModel
    ): Promise<ConditionTypeResult> {
        try {
            const conditionType = await this._repository.InsertAsync(
                createConditionTypeModel
            );
            return {
                isSuccess: true,
                message: "ConditionType created successfully",
                conditionType: conditionType as ConditionTypeModel,
            };
        } catch (error) {
            console.error("Error creating conditionType:", error);
            return {
                isSuccess: false,
                message: "ConditionType creation failed",
            };
        }
    }

    public async GetConditionTypeByIdAsync(
        id: number
    ): Promise<ConditionTypeResult> {
        try {
            const conditionType = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                        include: {
                            tools: true,
                        },
                    });
                }
            );

            if (conditionType) {
                return {
                    isSuccess: true,
                    message: "ConditionType retrieved successfully",
                    conditionType: conditionType as ConditionTypeModel,
                };
            } else {
                return {
                    isSuccess: false,
                    message: "ConditionType not found",
                };
            }
        } catch (error) {
            console.error("Error retrieving conditionType:", error);
            return {
                isSuccess: false,
                message: "ConditionType retrieval failed",
            };
        }
    }

    public async UpdateConditionTypeAsync(
        id: number,
        updateConditionTypeModel: UpdateConditionTypeModel
    ): Promise<ConditionTypeResult> {
        try {
            const conditionType = await this._repository.UpdateAsync({
                id,
                data: updateConditionTypeModel,
            });

            return {
                isSuccess: true,
                message: "ConditionType updated successfully",
                conditionType: conditionType as ConditionTypeModel,
            };
        } catch (error) {
            console.error("Error updating conditionType:", error);
            return {
                isSuccess: false,
                message: "ConditionType update failed",
            };
        }
    }

    public async DeleteConditionTypeAsync(
        id: number
    ): Promise<ConditionTypeResult> {
        try {
            const conditionTypeResult = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.conditionType.findFirst({
                        where: { id },
                    });
                }
            );

            if (!conditionTypeResult) {
                return {
                    isSuccess: false,
                    message: "ConditionType not found",
                };
            }

            await this._repository.DeleteAsync(conditionTypeResult);

            return {
                isSuccess: true,
                message: "ConditionType deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting conditionType:", error);
            return {
                isSuccess: false,
                message: "ConditionType deletion failed",
            };
        }
    }

    public async GetAllConditionTypesPagedAsync(
        params: GetAllConditionTypePagedParams
    ): Promise<PagedList<ConditionTypeModel>> {
        const { page, limit, search } = params;
        try {
            const result = await this._repository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const result = await query.findMany({
                        include: {
                            tools: true,
                        },
                    });

                    return result;
                }, page, limit
            );

            return result as PagedList<ConditionTypeModel>;
        } catch (error) {
            console.error("Error retrieving conditionTypes:", error);
            throw new Error("ConditionTypes retrieval failed");
        }
    }
}

export default ConditionTypeService;
