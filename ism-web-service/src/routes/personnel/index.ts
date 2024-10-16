import { Elysia, t } from "elysia";
import PersonnelService from "@/src/core/services/personnel/PersonnelService";
import {
    CreatePersonnelModel,
    UpdatePersonnelModel,
    GetAllPersonnelPagedParams,
} from "@/src/data/models/personnel/PersonnelModel";
import IPersonnelService from "@/src/core/services/personnel/IPersonnelService";
import PersonnelController from "./PersonnelController";
import { Token } from "@/src/data/models/generic/TokenModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";

const personnelService: IPersonnelService = new PersonnelService();
const authenticationService: IAuthenticationService = new AuthenticationService();
const personnelController = new PersonnelController(
    personnelService,
    authenticationService
);

const personnelRoutes = new Elysia({ prefix: "/personnel" })
    .get(
        "",
        async (
            req: ApiRequest<GetAllPersonnelPagedParams, {}, {}, Token>
        ) => {
            return await personnelController.getAllPersonnelPaged(req);
        }
    )
    .get("/all", async (req: ApiRequest<{}, {}, {}, Token>) => {
        return await personnelController.getAllPersonnel(req);
    })
    .get("/:id", async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
        return await personnelController.getPersonnelById(req);
    })
    .post(
        "/",
        async (req: ApiRequest<{}, {}, CreatePersonnelModel, Token>) => {
            return await personnelController.createPersonnel(req);
        }
    )
    .put(
        "/:id",
        async (req: ApiRequest<{}, { id: number }, UpdatePersonnelModel, Token>) => {
            return await personnelController.updatePersonnel(req);
        }
    )
    .post(
        "/delete/:id",
        async (req: ApiRequest<{}, { id: number }, {}, Token>) => {
            return await personnelController.deletePersonnel(req);
        }
    );

export default personnelRoutes;
