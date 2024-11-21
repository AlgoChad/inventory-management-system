export type ToolModel = {
    id: number;
    toolNumber: string;
    toolName: string;
    quantity: number;
    conditionId: number;
    statusId: number;
    personnelId?: number;
    createdAt: Date;
    updatedAt: Date;
    condition: any;
    status: any;
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

export type ToolRequestModel = {
    toolId: number;
    personnelId: number;
    quantity: number;
};

export type CreateToolRequestModel = Omit<
    ToolRequest,
    "id" | "status" | "createdAt" | "updatedAt" | "tool" | "personnel" | "project"
>;

export type UpdateToolRequestModel = Partial<CreateToolRequestModel>;

export type ToolRepairRequestModel = {
    toolId: number;
    personnelId: number;
    description: string;
    images: ImageModel[];
};

export type CreateToolRepairRequestModel = Omit<
    ToolRepairRequest,
    "id" | "status" | "createdAt" | "updatedAt" | "tool" | "personnel"
> & {
    images: ImageModel[];
};

export type UpdateToolRepairRequestModel = Partial<CreateToolRepairRequestModel>;

export type RequestResult = {
    isSuccess: boolean;
    message?: string;
};

export type ToolRequest = {
    id: number;
    toolId: number;
    personnelId: number;
    projectId: number
    quantity: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    tool: ToolModel;
    personnel: any;
    project: any;
};

export type ToolRepairRequest = {
    id: number;
    toolId: number;
    personnelId: number;
    description: string;
    quantity: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    tool: ToolModel;
    personnel: any;
    images: ImageModel[];
};

export type ImageModel = {
    id: number;
    name: string;
    base64: string;
    createdAt: Date;
    updatedAt: Date;
};
