
export type PersonnelModel = {
    id: number;
    name: string;
    userId?: number;
    user?: any; // Replace with actual User model if available
    createdAt: Date;
    updatedAt: Date;
    tools: any[]; // Replace with actual Tool model if available
};

export type CreatePersonnelModel = Omit<
    PersonnelModel,
    "id" | "createdAt" | "updatedAt" | "user" | "tools"
>;

export type UpdatePersonnelModel = Partial<CreatePersonnelModel>;

export type PersonnelResult = {
    isSuccess: boolean;
    message: string;
    personnel?: PersonnelModel;
};

export interface GetAllPersonnelPagedParams {
    page?: number;
    limit?: number;
    search?: string;
    column: string;
    direction: "asc" | "desc";
}
