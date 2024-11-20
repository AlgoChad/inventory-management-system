import IToolRequestService from "./IToolRequestService";
import {
    RequestResult,
    CreateToolRequestModel,
    UpdateToolRequestModel,
    CreateToolRepairRequestModel,
    UpdateToolRepairRequestModel,
    ToolRequest,
    ToolRepairRequest,
} from "@/src/data/models/tool/ToolModel";
import ToolRepairRequestRepository from "@/src/data/repository/ToolRepairRequestRepository";
import ToolRequestRepository from "@/src/data/repository/ToolRequestRepository";
import { PagedList } from "@/src/data/models/generic/PaginationModel";
import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";

class ToolRequestService implements IToolRequestService {
    private readonly _toolRequestRepository: typeof ToolRequestRepository;
    private readonly _toolRepairRequestRepository: typeof ToolRepairRequestRepository;

    constructor() {
        this._toolRequestRepository = ToolRequestRepository;
        this._toolRepairRequestRepository = ToolRepairRequestRepository;
    }

    public async GetAllToolsRequestPagedAsync(params: any): Promise<PagedList<ToolRequest>> {
        const { page, limit, search, column, direction } = params;
        try {
            const where = search ? {
                OR: [
                    {
                        tool: {
                            toolName: {
                                contains: search.toLocaleLowerCase().trim(),
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        tool: {
                            toolNumber: {
                                contains: search.toLocaleLowerCase().trim(),
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            } : {};

            const result = await this._toolRequestRepository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const orderBy: any = {};

                    if (column && direction) {
                        const formattedColumn = column.replace(/_/g, '.');
                        const keys = formattedColumn.split('.');
                        let current = orderBy;

                        for (let i = 0; i < keys.length - 1; i++) {
                            current[keys[i]] = current[keys[i]] || {};
                            current = current[keys[i]];
                        }

                        current[keys[keys.length - 1]] = direction;
                    }

                    const result = await query.findFirst({
                        where,
                        include: {
                            tool: true,
                            personnel: true,
                        },
                        orderBy: orderBy,
                    });

                    return result;
                }, page, limit, false
            );

            return result as PagedList<ToolRequest>;
        } catch (error) {
            console.error("Error retrieving tool requests:", error);
            throw new Error("Tool requests retrieval failed");
        }
    }

    public async GetAllToolsRepairRequestPagedAsync(params: any): Promise<PagedList<ToolRepairRequest>> {
        const { page, limit, search, column, direction } = params;
        try {
            const where = search ? {
                OR: [
                    {
                        tool: {
                            toolName: {
                                contains: search.toLocaleLowerCase().trim(),
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        tool: {
                            toolNumber: {
                                contains: search.toLocaleLowerCase().trim(),
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            } : {};

            const result = await this._toolRepairRequestRepository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const orderBy: any = {};

                    if (column && direction) {
                        const formattedColumn = column.replace(/_/g, '.');
                        const keys = formattedColumn.split('.');
                        let current = orderBy;

                        for (let i = 0; i < keys.length - 1; i++) {
                            current[keys[i]] = current[keys[i]] || {};
                            current = current[keys[i]];
                        }

                        current[keys[keys.length - 1]] = direction;
                    }

                    const result = await query.findMany({
                        where,
                        include: {
                            tool: true,
                            personnel: true,
                            images: true,
                        },
                        orderBy: orderBy,
                    });

                    return result;
                }, page, limit, false
            );

            return result as PagedList<ToolRepairRequest>;
        } catch (error) {
            console.error("Error retrieving tool repair requests:", error);
            throw new Error("Tool repair requests retrieval failed");
        }
    }

    public async GetToolRequestByIdAsync(id: number): Promise<ToolRequest | null> {
        try {
            const toolRequest = await this._toolRequestRepository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                        include: {
                            tool: true,
                            personnel: true,
                        },
                    });
                }
            );

            return toolRequest as ToolRequest;
        } catch (error) {
            console.error("Error retrieving tool request:", error);
            return null;
        }
    }

    public async GetToolRepairRequestByIdAsync(id: number): Promise<ToolRepairRequest | null> {
        try {
            const toolRepairRequest = await this._toolRepairRequestRepository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                        include: {
                            tool: true,
                            personnel: true,
                            images: true,
                        },
                    });
                }
            );

            return toolRepairRequest as ToolRepairRequest;
        } catch (error) {
            console.error("Error retrieving tool repair request:", error);
            return null;
        }
    }

    public async CreateToolRequestAsync(toolRequestModel: CreateToolRequestModel): Promise<RequestResult> {
        try {
            const toolRequestCreateInput: Prisma.ToolRequestCreateInput = {
                tool: {
                    connect: {
                        id: toolRequestModel.toolId,
                    },
                },
                personnel: {
                    connect: {
                        id: toolRequestModel.personnelId,
                    }
                },
                quantity: toolRequestModel.quantity,
                status: "PENDING"
            }

            const toolRequest = await this._toolRequestRepository.InsertAsync(toolRequestCreateInput);

            return { isSuccess: true, message: "Tool request created successfully" };
        } catch (error) {
            console.error("Error during tool request:", error);
            return { isSuccess: false, message: "Tool request failed" };
        }
    }

    public async CreateToolRepairRequestAsync(toolRepairRequestModel: CreateToolRepairRequestModel): Promise<RequestResult> {
        try {
            const toolRepairRequestCreateInput: Prisma.ToolRepairRequestCreateInput = {
                tool: {
                    connect: {
                        id: toolRepairRequestModel.toolId,
                    },
                },
                personnel: {
                    connect: {
                        id: toolRepairRequestModel.personnelId,
                    }
                },
                quantity: toolRepairRequestModel.quantity,
                description: toolRepairRequestModel.description,
                status: "PENDING",
                images: {
                    create: toolRepairRequestModel.images?.map((image) => ({
                        name: image.name,
                        base64: image.base64,
                    })),
                },
            }

            await this._toolRepairRequestRepository.InsertAsync(toolRepairRequestCreateInput);

            return { isSuccess: true, message: "Tool repair request created successfully" };
        } catch (error) {
            console.error("Error during tool repair request:", error);
            return { isSuccess: false, message: "Tool repair request failed" };
        }
    }

    public async UpdateToolRequestAsync(id: number, toolRequestModel: UpdateToolRequestModel): Promise<RequestResult> {
        try {
            const toolRequest = await this._toolRequestRepository.UpdateAsync({
                id,
                data: toolRequestModel,
            });

            return {
                isSuccess: true,
                message: "Tool request updated successfully",
            };
        } catch (error) {
            console.error("Error updating tool request:", error);
            return {
                isSuccess: false,
                message: "Tool request update failed",
            };
        }
    }

    public async UpdateToolRepairRequestAsync(id: number, toolRepairRequestModel: UpdateToolRepairRequestModel): Promise<RequestResult> {
        try {
            await this._toolRepairRequestRepository.UpdateAsync({
                id,
                data: {
                    ...toolRepairRequestModel,
                    images: {
                        deleteMany: {},
                        create: toolRepairRequestModel.images?.map((image) => ({
                            name: image.name,
                            base64: image.base64,
                        })),
                    },
                },
            });

            return {
                isSuccess: true,
                message: "Tool repair request updated successfully",
            };
        } catch (error) {
            console.error("Error updating tool repair request:", error);
            return {
                isSuccess: false,
                message: "Tool repair request update failed",
            };
        }
    }

    public async DeleteToolRequestAsync(id: number): Promise<RequestResult> {
        try {
            const toolRequestResult = await this._toolRequestRepository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                    });
                }
            );

            if (!toolRequestResult) {
                return {
                    isSuccess: false,
                    message: "Tool request not found",
                };
            }

            await this._toolRequestRepository.DeleteAsync(toolRequestResult);

            return {
                isSuccess: true,
                message: "Tool request deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting tool request:", error);
            return {
                isSuccess: false,
                message: "Tool request deletion failed",
            };
        }
    }

    public async DeleteToolRepairRequestAsync(id: number): Promise<RequestResult> {
        try {
            const toolRepairRequestResult = await this._toolRepairRequestRepository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: { id },
                    });
                }
            );

            if (!toolRepairRequestResult) {
                return {
                    isSuccess: false,
                    message: "Tool repair request not found",
                };
            }

            await this._toolRepairRequestRepository.DeleteAsync(toolRepairRequestResult);

            return {
                isSuccess: true,
                message: "Tool repair request deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting tool repair request:", error);
            return {
                isSuccess: false,
                message: "Tool repair request deletion failed",
            };
        }
    }
}

export default ToolRequestService;
