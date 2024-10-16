import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import {
    StatusTypeModel,
    CreateStatusTypeModel,
    UpdateStatusTypeModel,
    StatusTypeResult,
    GetAllStatusTypePagedParams,
} from "@/src/data/models/status-type/StatusTypeModel";
import IStatusTypeService from "./IStatusTypeService";
import StatusTypeRepository from "@/src/data/repository/StatusTypeRepository";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

class StatusTypeService implements IStatusTypeService {
    private readonly _repository: typeof StatusTypeRepository;

    constructor() {
        this._repository = StatusTypeRepository;
    }

    public async CreateStatusTypeAsync(
        createStatusTypeModel: CreateStatusTypeModel
    ): Promise<StatusTypeResult> {
        try {
            const statusType = await this._repository.InsertAsync(
                createStatusTypeModel
            );
            return {
                isSuccess: true,
                message: "StatusType created successfully",
                statusType: statusType as StatusTypeModel,
            };
        } catch (error) {
            console.error("Error creating statusType:", error);
            return {
                isSuccess: false,
                message: "StatusType creation failed",
            };
        }
    }

    public async GetStatusTypeByIdAsync(id: number): Promise<StatusTypeResult> {
        try {
            const statusType = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                        include: {
                            tools: true,
                        },
                    });
                }
            );

            if (statusType) {
                return {
                    isSuccess: true,
                    message: "StatusType retrieved successfully",
                    statusType: statusType as StatusTypeModel,
                };
            } else {
                return {
                    isSuccess: false,
                    message: "StatusType not found",
                };
            }
        } catch (error) {
            console.error("Error retrieving statusType:", error);
            return {
                isSuccess: false,
                message: "StatusType retrieval failed",
            };
        }
    }

    public async UpdateStatusTypeAsync(
        id: number,
        updateStatusTypeModel: UpdateStatusTypeModel
    ): Promise<StatusTypeResult> {
        try {
            const statusType = await this._repository.UpdateAsync({
                id,
                data: updateStatusTypeModel,
            });

            return {
                isSuccess: true,
                message: "StatusType updated successfully",
                statusType: statusType as StatusTypeModel,
            };
        } catch (error) {
            console.error("Error updating statusType:", error);
            return {
                isSuccess: false,
                message: "StatusType update failed",
            };
        }
    }

    public async DeleteStatusTypeAsync(id: number): Promise<StatusTypeResult> {
        try {
            const statusTypeResult = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                    });
                }
            );

            if (!statusTypeResult) {
                return {
                    isSuccess: false,
                    message: "StatusType not found",
                };
            }

            await this._repository.DeleteAsync(statusTypeResult);

            return {
                isSuccess: true,
                message: "StatusType deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting statusType:", error);
            return {
                isSuccess: false,
                message: "StatusType deletion failed",
            };
        }
    }

    public async GetAllStatusTypesPagedAsync(
        params: GetAllStatusTypePagedParams
    ): Promise<PagedList<StatusTypeModel>> {
        const { page, limit, search } = params;
        try {
            const where: Prisma.StatusTypeWhereInput = {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            };

            const result = await this._repository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const result = await query.findMany({
                        where,
                        include: {
                            tools: true,
                        },
                    });

                    return result;
                }, page, limit
            );

            return result as PagedList<StatusTypeModel>;
        } catch (error) {
            console.error("Error retrieving statusTypes:", error);
            throw new Error("StatusTypes retrieval failed");
        }
    }
}

export default StatusTypeService;
