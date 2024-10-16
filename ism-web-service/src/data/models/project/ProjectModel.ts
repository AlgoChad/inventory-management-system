import { Project } from "@prisma/client";

export type ProjectModel = {
    id: number;
    projectDescription: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    tools: any[]; // Replace with actual Tool model if available
    checkins: any[]; // Replace with actual Checkin model if available
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
