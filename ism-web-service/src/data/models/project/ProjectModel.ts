
export type ProjectModel = {
    id: number;
    projectName: string;
    projectDescription: string;
    color: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    checkins: any[];
};

export type CreateProjectModel = Omit<
    ProjectModel,
    "id" | "createdAt" | "updatedAt" | "tools" | "checkins"
>;
export type UpdateProjectModel = Partial<CreateProjectModel>;

export type ProjectResult = {
    isSuccess: boolean;
    message: string;
    project?: ProjectModel;
};

export interface GetAllProjectPagedParams {
    page?: number;
    limit?: number;
    search?: string;
    column: string;
    direction: "asc" | "desc";
}
