import {
    RegisterModel,
    LoginModel,
    LogoutModel,
    RefreshTokenModel,
    ValidateTokenResult,
    RefreshTokenResult,
    LoginResult,
    LogoutResult,
    UserAuthResult,
    ChangePasswordModel,
    ChangePasswordResult,
} from "@/src/data/models/authentication/AuthenticationModel";
import UserRepository from "@/src/data/repository/UserRepository";
import IAuthenticationService from "./IAuthenticationService";
import TokenHelper from "./helpers/Token";
import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";

class AuthenticationService implements IAuthenticationService {
    private readonly _repository: typeof UserRepository;
    private readonly _tokenHelper: TokenHelper;

    constructor() {
        this._repository = UserRepository;
        this._tokenHelper = new TokenHelper(UserRepository);
    }

    public async RegisterAsync(registerModel: RegisterModel): Promise<boolean> {
        const { name, email, password } = registerModel;
        try {
            const userAlreadyExists = async (email: string, name: string) => {
                const user = await this._repository.GetEntityAsync(
                    async (query: PrismaClient) => {
                        return await query.findFirst({
                            where: {
                                username: email,
                                personnel: {
                                    name: name,
                                },
                            },
                        });
                    }
                );

                return user !== null;
            };

            if (await userAlreadyExists(email, name)) {
                return false;
            }

            const hashedPassword = await Bun.password.hash(password, {
                algorithm: "bcrypt",
                cost: 5,
            });

            const userAuthData: Prisma.UserCreateInput = {
                username: email,
                password: hashedPassword,
                personnel: {
                    create: {
                        name: name,
                    },
                },
            };

            const result = await this._repository.InsertAsync(userAuthData);

            return result !== null;
        } catch (error) {
            console.error("Error during registration:", error);
            throw new Error("Registration failed");
        }
    }

    public async LoginAsync(loginModel: LoginModel): Promise<LoginResult> {
        const { username, password } = loginModel;
        try {
            const user = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: {
                            username: username,
                        },
                    });
                }
            );

            if (user === null) {
                throw new Error("User not found");
            }

            if (!user?.password) {
                throw new Error("Password is undefined");
            }
            const currentHashedPassword: string = user.password.toString();
            const isPasswordValid = await Bun.password.verify(
                password,
                currentHashedPassword
            );

            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }

            if (user?.accessToken && user?.refreshToken) {
                const [
                    [isTokenValid, userData],
                    [isRefreshTokenValid, userDataRefresh],
                ] = await Promise.all([
                    this._tokenHelper.ValidateAccessTokenAsync(
                        user.accessToken
                    ),
                    this._tokenHelper.ValidateRefreshTokenAsync(
                        user.accessToken,
                        user.refreshToken
                    ),
                ]);

                if (isTokenValid && isRefreshTokenValid) {
                    return {
                        isSuccess: true,
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        userId: user.id as number,
                    };
                } else {
                    await this._repository.UpdateAsync({
                        id: user.id as number,
                        data: {
                            accessToken: "",
                            refreshToken: "",
                        },
                    });
                }
            }

            const [accessToken, refreshToken] = await Promise.all([
                user ? this._tokenHelper.GenerateTokenAsync(user.id) : null,
                user
                    ? this._tokenHelper.GenerateRefreshTokenAsync(user.id)
                    : null,
            ]);

            if (accessToken && refreshToken) {
                return {
                    isSuccess: true,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userId: user.id as number,
                };
            } else {
                return {
                    isSuccess: false,
                    accessToken: "",
                    refreshToken: "",
                };
            }
        } catch (error) {
            console.error("Error during login:", error);
            throw new Error("Login failed");
        }
    }

    public async LogoutAsync(logoutModel: LogoutModel): Promise<LogoutResult> {
        const { username, accessToken } = logoutModel;
        try {
            const [isTokenValid, userData] =
                await this._tokenHelper.ValidateAccessTokenAsync(accessToken);
            if (isTokenValid) {
                const result = await this._repository.UpdateAsync({
                    id: userData?.id as number,
                    data: {
                        accessToken: "",
                        refreshToken: "",
                    },
                });

                return {
                    isSuccess: result !== null,
                };
            } else {
                return {
                    isSuccess: false,
                };
            }
        } catch (error) {
            console.error("Error during logout:", error);
            throw new Error("Logout failed");
        }
    }
    
    public async ChangePasswordAsync(changePasswordModel: ChangePasswordModel): Promise<ChangePasswordResult> {
        const { userId, oldPassword, newPassword } = changePasswordModel;
        try {
            const user = await this._repository.GetEntityAsync(
                async (query: PrismaClient) => {
                    return await query.findFirst({
                        where: {
                            id: userId,
                        },
                    });
                }
            );

            if (user === null) {
                return { isSuccess: false, message: "User not found" };
            }

            if (user?.isPasswordChanged) {
                return { isSuccess: false, message: "Password has already been changed" };
            }

            if (!user?.password) {
                return { isSuccess: false, message: "Password is undefined" };
            }

            const currentHashedPassword: string = user.password.toString();
            const isOldPasswordValid = await Bun.password.verify(
                oldPassword,
                currentHashedPassword
            );

            if (!isOldPasswordValid) {
                return { isSuccess: false, message: "Invalid old password" };
            }

            const newHashedPassword = await Bun.password.hash(newPassword, {
                algorithm: "bcrypt",
                cost: 5,
            });

            const result = await this._repository.UpdateAsync({
                id: user.id as number,
                data: {
                    password: newHashedPassword,
                    isPasswordChanged: true,
                },
            });

            return result !== null
                ? { isSuccess: true, message: "Password changed successfully" }
                : { isSuccess: false, message: "Password change failed" };
        } catch (error) {
            console.error("Error during password change:", error);
            return { isSuccess: false, message: "Password change failed" };
        }
    }

    public async ValidateTokenAsync(
        accessToken: string
    ): Promise<ValidateTokenResult> {
        try {
            const [isTokenValid, userData] =
                await this._tokenHelper.ValidateAccessTokenAsync(accessToken);
            if (isTokenValid && userData) {
                return {
                    isValid: true,
                };
            }

            if (!isTokenValid && userData) {
                const token = await this._tokenHelper.GenerateTokenAsync(
                    userData?.id as number
                );

                if (token) {
                    return {
                        isValid: true,
                    };
                }
            } else {
                return {
                    isValid: false,
                    message: "Token validation failed",
                };
            }
        } catch (error) {
            console.error("Error during token validation:", error);
            return {
                isValid: false,
                message: "Token validation failed",
            };
        }
        return {
            isValid: false,
            message: "Token validation failed",
        };
    }

    public async RefreshTokenAsync(
        refreshTokenModel: RefreshTokenModel
    ): Promise<RefreshTokenResult> {
        const { accessToken, refreshToken } = refreshTokenModel;
        try {
            const [isTokenValid, userData] =
                await this._tokenHelper.ValidateAccessTokenAsync(accessToken);
            if (isTokenValid && userData) {
                if (userData?.id !== undefined) {
                    const newRefreshToken =
                        await this._tokenHelper.GenerateRefreshTokenAsync(
                            userData.id as number
                        );
                    return {
                        accessToken: accessToken,
                        refreshToken: newRefreshToken,
                        isValid: true,
                    };
                } else {
                    throw new Error("User ID is undefined");
                }
            } else {
                return {
                    isValid: false,
                    message: "Token validation failed",
                };
            }
        } catch (error) {
            console.error("Error during token refresh:", error);
            return {
                isValid: false,
                message: "Token refresh failed",
            };
        }
    }
}

export default AuthenticationService;
