
export type ToolModel = {
    id: number;
    toolNumber: string;
    toolDescription: string;
    quantity: number;
    conditionId: number;
    statusId: number;
    projectId?: number;
    personnelId?: number;
    createdAt: Date;
    updatedAt: Date;
    condition: any;
    status: any;
    project?: any;
    personnel?: any;
    checkins: any[];
};

export type CreateToolModel = Omit<
    ToolModel,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "condition"
    | "status"
    | "project"
    | "personnel"
    | "checkins"
>;
export type UpdateToolModel = Partial<CreateToolModel>;

export type ToolResult = {
    isSuccess: boolean;
    message: string;
    tool?: ToolModel;
};

export interface GetAllToolPagedParams {
    page?: number;
    limit?: number;
    search?: string;
    column: string;
    direction: "asc" | "desc";
}
