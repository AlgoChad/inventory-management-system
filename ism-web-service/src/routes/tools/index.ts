import { Elysia, t } from "elysia";
import ToolService from "@/src/core/services/tools/ToolService";
import {
    CreateToolModel,
    UpdateToolModel,
    GetAllToolPagedParams,
} from "@/src/data/models/tool/ToolModel";
import IToolService from "@/src/core/services/tools/IToolService";
import ToolController from "./ToolController";
import { Token } from "@/src/data/models/generic/TokenModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";

const toolService: IToolService = new ToolService();
const authenticationService: IAuthenticationService =
    new AuthenticationService();
const toolController = new ToolController(toolService, authenticationService);

const toolRoutes = new Elysia({ prefix: "/tools" })
    .get("", async (req: ApiRequest<GetAllToolPagedParams, {}, {}, Token>) => {
        return await toolController.getAllToolsPaged(req);
    })
    .get("/all", async (req: ApiRequest<{}, {}, {}, Token>) => {
        return await toolController.getAllTools(req);
    })
    .get("/:id", async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
        return await toolController.getToolById(req);
    })
    .post("/", async (req: ApiRequest<{}, {}, CreateToolModel, Token>) => {
        return await toolController.createTool(req);
    })
    .put(
        "/:id",
        async (req: ApiRequest<{}, { id: number }, UpdateToolModel, Token>) => {
            return await toolController.updateTool(req);
        }
    )
    .post(
        "/delete/:id",
        async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
            return await toolController.deleteTool(req);
        }
    );

export default toolRoutes;
