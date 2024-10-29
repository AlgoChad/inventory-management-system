import { 
    RegisterModel, 
    LoginModel, 
    LogoutModel, 
    RefreshTokenModel, 
    ValidateTokenResult, 
    RefreshTokenResult, 
    LoginResult, 
    LogoutResult, 
    ChangePasswordModel, 
    ChangePasswordResult 
} from "@/src/data/models/authentication/AuthenticationModel";

export default interface IAuthenticationService {
    RegisterAsync(registerModel: RegisterModel): Promise<boolean>;
    LoginAsync(loginModel: LoginModel): Promise<LoginResult>;
    LogoutAsync(logoutModel: LogoutModel): Promise<LogoutResult>;
    ChangePasswordAsync(changePasswordModel: ChangePasswordModel): Promise<ChangePasswordResult>;
    ValidateTokenAsync(accessToken: string): Promise<ValidateTokenResult>;
    RefreshTokenAsync(refreshTokenModel: RefreshTokenModel): Promise<RefreshTokenResult>;
}
