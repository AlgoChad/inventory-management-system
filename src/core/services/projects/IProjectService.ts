import { ProjectModel, CreateProjectModel, UpdateProjectModel, ProjectResult, GetAllProjectPagedParams } from "@/src/data/models/project/ProjectModel";
import { PagedList } from "@/src/data/models/generic/PaginationModel";

export default interface IProjectService {
  CreateProjectAsync(createProjectModel: CreateProjectModel): Promise<ProjectResult>;
  GetProjectByIdAsync(id: number): Promise<ProjectResult>;
  UpdateProjectAsync(id: number, updateProjectModel: UpdateProjectModel): Promise<ProjectResult>;
  DeleteProjectAsync(id: number): Promise<ProjectResult>;
  GetAllProjectsPagedAsync(params: GetAllProjectPagedParams): Promise<PagedList<ProjectModel>>;
}
