import { Elysia, t } from "elysia";
import ProjectService from "@/src/core/services/projects/ProjectService";
import {
    CreateProjectModel,
    UpdateProjectModel,
    GetAllProjectPagedParams,
} from "@/src/data/models/project/ProjectModel";
import IProjectService from "@/src/core/services/projects/IProjectService";
import ProjectController from "./ProjectController";
import { Token } from "@/src/data/models/generic/TokenModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";

const projectService: IProjectService = new ProjectService();
const authenticationService: IAuthenticationService =
    new AuthenticationService();
const projectController = new ProjectController(
    projectService,
    authenticationService
);

const projectRoutes = new Elysia({ prefix: "/projects" })
    .get(
        "",
        async (req: ApiRequest<GetAllProjectPagedParams, {}, {}, Token>) => {
            return await projectController.getAllProjects(req);
        }
    )
    .get("/:id", async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
        return await projectController.getProjectById(req);
    })
    .post("/", async (req: ApiRequest<{}, {}, CreateProjectModel, Token>) => {
        return await projectController.createProject(req);
    })
    .put(
        "/:id",
        async (
            req: ApiRequest<{}, { id: number }, UpdateProjectModel, Token>
        ) => {
            return await projectController.updateProject(req);
        }
    )
    .post(
        "/delete/:id",
        async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
            return await projectController.deleteProject(req);
        }
    );

export default projectRoutes;
