import { Elysia, t } from "elysia";
import ConditionTypeService from "@/src/core/services/condition-type/ConditionTypeService";
import {
    CreateConditionTypeModel,
    UpdateConditionTypeModel,
    GetAllConditionTypePagedParams,
} from "@/src/data/models/condition-type/ConditionTypeModel";
import IConditionTypeService from "@/src/core/services/condition-type/IConditionTypeService";
import ConditionTypeController from "./ConditionTypeController";
import { Token } from "@/src/data/models/generic/TokenModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";

const conditionTypeService: IConditionTypeService = new ConditionTypeService();
const authenticationService: IAuthenticationService =
    new AuthenticationService();
const conditionTypeController = new ConditionTypeController(
    conditionTypeService,
    authenticationService
);

const conditionTypeRoutes = new Elysia({ prefix: "/condition-types" })
    .get(
        "",
        async (
            req: ApiRequest<GetAllConditionTypePagedParams, {}, {}, Token>
        ) => {
            return await conditionTypeController.getAllConditionTypes(req);
        }
    )
    .get("/:id", async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
        return await conditionTypeController.getConditionTypeById(req);
    })
    .post(
        "/",
        async (req: ApiRequest<{}, {}, CreateConditionTypeModel, Token>) => {
            return await conditionTypeController.createConditionType(req);
        }
    )
    .put(
        "/:id",
        async (req: ApiRequest<{}, { id: number }, UpdateConditionTypeModel, Token>) => {
            return await conditionTypeController.updateConditionType(req);
        }
    )
    .post(
        "/delete/:id",
        async (req: ApiRequest<{ }, { id: number }, {}, Token>) => {
            return await conditionTypeController.deleteConditionType(req);
        }
    );

export default conditionTypeRoutes;
