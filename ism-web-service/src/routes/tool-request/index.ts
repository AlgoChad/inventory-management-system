import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";
import {
    CreateToolRequestModel,
    UpdateToolRequestModel,
    CreateToolRepairRequestModel,
    UpdateToolRepairRequestModel,
} from "@/src/data/models/tool/ToolModel";
import ToolRequestController from "./ToolRequestController";
import IToolRequestService from "@/src/core/services/tool-request/IToolRequestService";
import ToolRequestService from "@/src/core/services/tool-request/ToolRequestService";
import Elysia from "elysia";

const authenticationService: IAuthenticationService = new AuthenticationService();
const toolRequestService: IToolRequestService = new ToolRequestService();
const toolRequestController = new ToolRequestController(toolRequestService, authenticationService);

const toolRequestRoutes = new Elysia({ prefix: "/tool-request" })
    .get("/requests", async (req: ApiRequest<{}, {}, { page: number; limit: number; search?: string; column?: string; direction?: "asc" | "desc" }>) => {
        return await toolRequestController.getAllToolRequests(req);
    })
    .get("/repair-requests", async (req: ApiRequest<{}, {}, { page: number; limit: number; search?: string; column?: string; direction?: "asc" | "desc" }>) => {
        return await toolRequestController.getAllToolRepairRequests(req);
    })
    .get("/request/:id", async (req: ApiRequest<{}, {id: number}, {}>) => {
        return await toolRequestController.getToolRequestById(req);
    })
    .get("/repair-request/:id", async (req:  ApiRequest<{}, {id: number}, {}>) => {
        return await toolRequestController.getToolRepairRequestById(req);
    })
    .post("/create-request", async (req: ApiRequest<{}, {}, CreateToolRequestModel>) => {
        return await toolRequestController.createToolRequest(req);
    })
    .post("/create-repair-request", async (req: ApiRequest<{}, {}, CreateToolRepairRequestModel>) => {
        return await toolRequestController.createToolRepairRequest(req);
    })
    .put("/update-request/:id", async (req: ApiRequest<{}, {id: number}, UpdateToolRequestModel>) => {
        return await toolRequestController.updateToolRequest(req);
    })
    .put("/update-repair-request/:id", async (req: ApiRequest<{}, { id: number }, UpdateToolRepairRequestModel>) => {
        return await toolRequestController.updateToolRepairRequest(req);
    })
    .delete("/delete-request/:id", async (req: ApiRequest<{}, { id: number }, {}>) => {
        return await toolRequestController.deleteToolRequest(req);
    })
    .delete("/delete-repair-request/:id", async (req: ApiRequest<{}, { id: number }, {}>) => {
        return await toolRequestController.deleteToolRepairRequest(req);
    });

export default toolRequestRoutes;
