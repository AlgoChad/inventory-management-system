
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
  condition: any; // Replace with actual ConditionType model if available
  status: any; // Replace with actual StatusType model if available
  project?: any; // Replace with actual Project model if available
  personnel?: any; // Replace with actual Personnel model if available
  checkin: any[]; // Replace with actual Checkin model if available
}

export type CreateToolModel = Omit<ToolModel, 'id' | 'createdAt' | 'updatedAt' | 'condition' | 'status' | 'project' | 'personnel' | 'checkins'>;
export type UpdateToolModel = Partial<CreateToolModel>;

export type ToolResult = {
  isSuccess: boolean;
  message: string;
  tool?: ToolModel;
}

export interface GetAllToolPagedParams {
  page?: number;
  limit?: number;
  search?: string;
}
