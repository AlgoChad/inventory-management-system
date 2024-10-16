import { Elysia, t } from "elysia";
import CheckinService from "@/src/core/services/checkins/CheckinService";
import {
    CreateCheckinModel,
    UpdateCheckinModel,
    GetAllCheckinPagedParams,
} from "@/src/data/models/checkin/CheckinModel";
import ICheckinService from "@/src/core/services/checkins/ICheckinService";
import CheckinController from "./CheckinController";
import { Token } from "@/src/data/models/generic/TokenModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";

const checkinService: ICheckinService = new CheckinService();
const authenticationService: IAuthenticationService =
    new AuthenticationService();
const checkinController = new CheckinController(
    checkinService,
    authenticationService
);

const checkinRoutes = new Elysia({ prefix: "/checkins" })
    .get(
        "",
        async (req: ApiRequest<GetAllCheckinPagedParams, {}, {}, Token>) => {
            return await checkinController.getAllCheckins(req);
        }
    )
    .get("/:id", async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
        return await checkinController.getCheckinById(req);
    })
    .post("/", async (req: ApiRequest<{}, {}, CreateCheckinModel, Token>) => {
        return await checkinController.createCheckin(req);
    })
    .put(
        "/:id",
        async (
            req: ApiRequest<{}, { id: number }, UpdateCheckinModel, Token>
        ) => {
            return await checkinController.updateCheckin(req);
        }
    )
    .post(
        "/delete/:id",
        async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
            return await checkinController.deleteCheckin(req);
        }
    );

export default checkinRoutes;
