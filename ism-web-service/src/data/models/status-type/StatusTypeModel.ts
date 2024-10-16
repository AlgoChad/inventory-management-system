import { StatusType } from "@prisma/client";

export type StatusTypeModel = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    tools: any[]; // Replace with actual Tool model if available
};

export type CreateStatusTypeModel = Omit<
    StatusTypeModel,
    "id" | "createdAt" | "updatedAt" | "tools"
>;
export type UpdateStatusTypeModel = Partial<CreateStatusTypeModel>;

export type StatusTypeResult = {
    isSuccess: boolean;
    message: string;
    statusType?: StatusTypeModel;
};

export interface GetAllStatusTypePagedParams {
    page?: number;
    limit?: number;
    search?: string;
    column: string;
    direction: "asc" | "desc";
}
