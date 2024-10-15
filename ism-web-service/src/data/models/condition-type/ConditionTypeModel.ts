import { ConditionType } from "@prisma/client";

export type ConditionTypeModel = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  tools: any[]; // Replace with actual Tool model if available
}

export type CreateConditionTypeModel = Omit<ConditionTypeModel, 'id' | 'createdAt' | 'updatedAt' | 'tools'>;
export type UpdateConditionTypeModel = Partial<CreateConditionTypeModel>;

export type ConditionTypeResult = {
  isSuccess: boolean;
  message: string;
  conditionType?: ConditionTypeModel;
}

export interface GetAllConditionTypePagedParams {
  page?: number;
  limit?: number;
  search?: string;
}
