export type CheckinModel = {
    id: number;
    toolId: number;
    projectId: number;
    checkInDate: Date;
    checkOutDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    tool: any;
    project: any;
};

export type CreateCheckinModel = Omit<
    CheckinModel,
    "id" | "createdAt" | "updatedAt"
>;
export type UpdateCheckinModel = Partial<CreateCheckinModel>;

export type CheckinResult = {
    isSuccess: boolean;
    message: string;
    checkin?: CheckinModel;
};

export interface GetAllCheckinPagedParams {
    page?: number;
    limit?: number;
    search?: string;
    column: string;
    direction: "asc" | "desc";
}
