import { Checkin } from "@prisma/client";

export type CheckinModel = {
  id: number;
  toolId: number;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
  tool: any; // Replace with actual Tool model if available
  project: any; // Replace with actual Project model if available
}

export type CreateCheckinModel = Omit<CheckinModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCheckinModel = Partial<CreateCheckinModel>;

export type CheckinResult = {
  isSuccess: boolean;
  message: string;
  checkin?: CheckinModel;
}

export interface GetAllCheckinPagedParams {
  page?: number;
  limit?: number;
  search?: string;
}
