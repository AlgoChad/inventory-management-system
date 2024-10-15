import { Elysia, t } from "elysia";
import AuthenticationService from "@/src/core/services/authentication/AuthenticationService";
import {
    RegisterModel,
    LoginModel,
    LogoutModel,
    RefreshTokenModel,
} from "@/src/data/models/authentication/AuthenticationModel";
import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import AuthenticationController from "./AuthenticationController";
import { ApiRequest } from "@/src/data/models/generic/ApiModel";

const authService: IAuthenticationService = new AuthenticationService();
const authController = new AuthenticationController(authService);

const authenticationRoutes = new Elysia({ prefix: "/auth" })
    .post("/register", async (req: ApiRequest<{}, {}, RegisterModel>) => {
        return await authController.register(req);
    })
    .post("/login", async (req: ApiRequest<{}, {}, LoginModel>) => {
        return await authController.login(req);
    })
    .post("/logout", async (req: ApiRequest<{}, {}, LogoutModel>) => {
        return await authController.logout(req);
    })
    .post("/validate-token", async (req: ApiRequest<{}, {}, { accessToken: string }>) => {
        return await authController.validateToken(req);
    })
    .post("/refresh-token", async (req: ApiRequest<{}, {}, RefreshTokenModel>) => {
        return await authController.refreshToken(req);
    });

export default authenticationRoutes;
