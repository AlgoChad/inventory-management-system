import IAuthenticationService from "@/src/core/services/authentication/IAuthenticationService";
import {
    RegisterModel,
    LoginModel,
    LogoutModel,
    RefreshTokenModel,
    ValidateTokenResult,
    RefreshTokenResult,
    LoginResult,
    LogoutResult,
} from "@/src/data/models/authentication/AuthenticationModel";
import {
    ApiResponse,
    ProblemDetail,
    ApiRequest,
} from "@/src/data/models/generic/ApiModel";
import { CreateResponse } from "@/src/core/helpers/RestHelpers";
import BaseController from "@/src/core/classes/BaseController";

class AuthenticationController extends BaseController {
    protected authService: IAuthenticationService;

    constructor(authService: IAuthenticationService) {
        super(authService);
        this.authService = authService;
    }

    public async register(
        req: ApiRequest<{}, {}, RegisterModel>
    ): Promise<ApiResponse<boolean> | ProblemDetail> {
        try {
            const result = await this.authService.RegisterAsync(req.body.payload);
            return CreateResponse<boolean>(
                result ? "success" : "error",
                result ? "Registration successful" : "Registration failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async login(
        req: ApiRequest<{}, {}, LoginModel>
    ): Promise<ApiResponse<LoginResult> | ProblemDetail> {
        try {
            const result = await this.authService.LoginAsync(req.body.payload);
            return CreateResponse<LoginResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Login successful" : "Login failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async logout(
        req: ApiRequest<{}, {}, LogoutModel>
    ): Promise<ApiResponse<LogoutResult> | ProblemDetail> {
        try {
            const result = await this.authService.LogoutAsync(req.body.payload);
            return CreateResponse<LogoutResult>(
                result.isSuccess ? "success" : "error",
                result.isSuccess ? "Logout successful" : "Logout failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async validateToken(
        req: ApiRequest<{}, {}, { accessToken: string }>
    ): Promise<ApiResponse<ValidateTokenResult> | ProblemDetail> {
        try {
            const result = await this.authService.ValidateTokenAsync(req.body.payload.accessToken);
            return CreateResponse<ValidateTokenResult>(
                result.isValid ? "success" : "error",
                result.isValid ? "Token is valid" : "Token validation failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async refreshToken(
        req: ApiRequest<{}, {}, RefreshTokenModel>
    ): Promise<ApiResponse<RefreshTokenResult> | ProblemDetail> {
        try {
            const result = await this.authService.RefreshTokenAsync(req.body.payload);
            return CreateResponse<RefreshTokenResult>(
                result.isValid ? "success" : "error",
                result.isValid ? "Token refreshed successfully" : "Token refresh failed",
                undefined,
                result
            );
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default AuthenticationController;
