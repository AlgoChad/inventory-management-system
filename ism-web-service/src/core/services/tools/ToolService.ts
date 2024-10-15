import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import {
    ToolModel,
    CreateToolModel,
    UpdateToolModel,
    ToolResult,
    GetAllToolPagedParams,
} from "@/src/data/models/tool/ToolModel";
import IToolService from "./IToolService";
import ToolRepository from "@/src/data/repository/ToolRepository";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

class ToolService implements IToolService {
    private readonly _repository: typeof ToolRepository;

    constructor() {
        this._repository = ToolRepository;
    }

    public async CreateToolAsync(
        createToolModel: CreateToolModel
    ): Promise<ToolResult> {
        try {
            const toolCreateInput: Prisma.ToolCreateInput = {
                ...createToolModel,
                condition: {
                    connect: {
                        id: createToolModel.conditionId,
                    },
                },
                status: {
                    connect: {
                        id: createToolModel.statusId,
                    },
                },
            };

            const tool = await this._repository.InsertAsync(toolCreateInput);
            return {
                isSuccess: true,
                message: "Tool created successfully",
                tool: tool as ToolModel,
            };
        } catch (error) {
            console.error("Error creating tool:", error);
            return {
                isSuccess: false,
                message: "Tool creation failed",
            };
        }
    }

    public async GetToolByIdAsync(id: number): Promise<ToolResult> {
        try {
            const tool = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.tool.findFirst({
                        where: { id },
                        include: {
                            condition: true,
                            status: true,
                            project: true,
                            personnel: true,
                            Checkin: true,
                        },
                    });
                }
            );

            if (tool) {
                return {
                    isSuccess: true,
                    message: "Tool retrieved successfully",
                    tool: tool as ToolModel,
                };
            } else {
                return {
                    isSuccess: false,
                    message: "Tool not found",
                };
            }
        } catch (error) {
            console.error("Error retrieving tool:", error);
            return {
                isSuccess: false,
                message: "Tool retrieval failed",
            };
        }
    }

    public async UpdateToolAsync(
        id: number,
        updateToolModel: UpdateToolModel
    ): Promise<ToolResult> {
        try {
            const tool = await this._repository.UpdateAsync({
                id,
                data: updateToolModel,
            });

            return {
                isSuccess: true,
                message: "Tool updated successfully",
                tool: tool as ToolModel,
            };
        } catch (error) {
            console.error("Error updating tool:", error);
            return {
                isSuccess: false,
                message: "Tool update failed",
            };
        }
    }

    public async DeleteToolAsync(id: number): Promise<ToolResult> {
        try {
            const toolResult = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.tool.findFirst({
                        where: { id },
                    });
                }
            );

            if (!toolResult) {
                return {
                    isSuccess: false,
                    message: "Tool not found",
                };
            }

            await this._repository.DeleteAsync(toolResult);

            return {
                isSuccess: true,
                message: "Tool deleted successfully",
            };
        } catch (error) {
            console.error("Error deleting tool:", error);
            return {
                isSuccess: false,
                message: "Tool deletion failed",
            };
        }
    }

    public async GetAllToolsPagedAsync(
        params: GetAllToolPagedParams
    ): Promise<PagedList<ToolModel>> {
        const { page, limit, search } = params;
        try {
            const where: Prisma.ToolWhereInput = {
                toolDescription: {
                    contains: search,
                    mode: "insensitive",
                },
            };

            const result = await this._repository.GetAllPagedAsync(
                async (query: PrismaClient) => {
                    const result = await query.tool.findMany({
                        where,
                        include: {
                            condition: true,
                            status: true,
                            project: true,
                            personnel: true,
                            checkins: true,
                        },
                    });

                    return result;
                }, page, limit
            );

            return result as PagedList<ToolModel>;
        } catch (error) {
            console.error("Error retrieving tools:", error);
            throw new Error("Tools retrieval failed");
        }
    }
}

export default ToolService;
