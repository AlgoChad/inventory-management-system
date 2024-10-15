import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import {
    CheckinModel,
    CreateCheckinModel,
    UpdateCheckinModel,
    CheckinResult,
    GetAllCheckinPagedParams,
} from "@/src/data/models/checkin/CheckinModel";
import ICheckinService from "./ICheckinService";
import CheckinRepository from "@/src/data/repository/CheckinRepository";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

class CheckinService implements ICheckinService {
    private readonly _repository: typeof CheckinRepository;

    constructor() {
        this._repository = CheckinRepository;
    }

    public async CreateCheckinAsync(
        createCheckinModel: CreateCheckinModel
    ): Promise<CheckinResult> {
        try {
            const checkin = await this._repository.InsertAsync(
                createCheckinModel
            );
            return {
                isSuccess: true,
                message: "Checkin created successfully",
                checkin: checkin as CheckinModel,
            };
        } catch (error) {
            console.error("Error creating checkin:", error);
            return {
                isSuccess: false,
                message: "Checkin creation failed",
            };
        }
    }

    public async GetCheckinByIdAsync(id: number): Promise<CheckinResult> {
        try {
            const checkin = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                        include: {
                            tool: true,
                            project: true,
                        },
                    });
                }
            );

            if (checkin) {
                return {
                    isSuccess: true,
                    message: "Checkin retrieved successfully",
                    checkin: checkin as CheckinModel,
                };
            } else {
                return {
                    isSuccess: false,
                    message: "Checkin not found",
                };
            }
        } catch (error) {
            console.error("Error retrieving checkin:", error);
            return {
                isSuccess: false,
                message: "Checkin retrieval failed",
            };
        }
    }

    public async UpdateCheckinAsync(
        id: number,
        updateCheckinModel: UpdateCheckinModel
    ): Promise<CheckinResult> {
        try {
            const checkin = await this._repository.UpdateAsync({
                id,
                data: updateCheckinModel,
            });

            return {
                isSuccess: true,
                message: "Checkin updated successfully",
                checkin: checkin as CheckinModel,
            };
        } catch (error) {
            console.error("Error updating checkin:", error);
            return {
                isSuccess: false,
                message: "Checkin update failed",
            };
        }
    }

    public async DeleteCheckinAsync(id: number): Promise<CheckinResult> {
        try {
            const checkinResult = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                    });
                }
            );

            if (!checkinResult) {
                return {
                    isSuccess: false,
                    message: "Checkin not found",
                };
            }

            await this._repository.DeleteAsync(checkinResult);

            return {
                isSuccess: true,
                message: "Checkin deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting checkin:", error);
            return {
                isSuccess: false,
                message: "Checkin deletion failed",
            };
        }
    }

    public async GetAllCheckinsPagedAsync(
        params: GetAllCheckinPagedParams
    ): Promise<PagedList<CheckinModel>> {
        const { page, limit, search } = params;
        try {
            const where: Prisma.CheckinWhereInput = {
                tool: {
                    toolDescription: {
                        contains: params.search,
                        mode: "insensitive",
                    },
                },
            };

            const result = await this._repository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const result = await query.findMany({
                        where,
                        include: {
                            tool: true,
                            project: true,
                        },
                    });

                    return result;
                }, page, limit
            );

            return result as PagedList<CheckinModel>;
        } catch (error) {
            console.error("Error retrieving checkins:", error);
            throw new Error("Checkins retrieval failed");
        }
    }
}

export default CheckinService;
