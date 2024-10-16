import { Elysia, t } from "elysia";
import StatusTypeService from "@/src/core/services/status-type/StatusTypeService";
import {
    CreateStatusTypeModel,
    UpdateStatusTypeModel,
    GetAllStatusTypePagedParams,
} from "@/src/data/models/status-type/StatusTypeModel";
import IStatusTypeService from "@/src/core/services/status-type/IStatusTypeService";
import StatusTypeController from "./StatusTypeController";
import { Token } from "@/src/data/models/generic/TokenModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";

const statusTypeService: IStatusTypeService = new StatusTypeService();
const authenticationService: IAuthenticationService =
    new AuthenticationService();
const statusTypeController = new StatusTypeController(
    statusTypeService,
    authenticationService
);

const statusTypeRoutes = new Elysia({ prefix: "/status-types" })
    .get(
        "",
        async (req: ApiRequest<GetAllStatusTypePagedParams, {}, {}, Token>) => {
            return await statusTypeController.getAllStatusTypes(req);
        }
    )
    .get("/:id", async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
        return await statusTypeController.getStatusTypeById(req);
    })
    .post(
        "/",
        async (req: ApiRequest<{}, {}, CreateStatusTypeModel, Token>) => {
            return await statusTypeController.createStatusType(req);
        }
    )
    .put(
        "/:id",
        async (
            req: ApiRequest<{}, { id: number }, UpdateStatusTypeModel, Token>
        ) => {
            return await statusTypeController.updateStatusType(req);
        }
    )
    .post(
        "/delete/:id",
        async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
            return await statusTypeController.deleteStatusType(req);
        }
    );

export default statusTypeRoutes;
