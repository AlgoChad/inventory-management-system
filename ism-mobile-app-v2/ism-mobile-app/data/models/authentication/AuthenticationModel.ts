export type LoginModel = {
    username?: string;
    email?: string;
    password: string;
};

export type RegisterModel = {
    name: string;
    email: string;
    password: string;
};

export type LogoutModel = {
    username: string;
    accessToken: string;
};

export type RefreshTokenModel = {
    accessToken: string;
    refreshToken: string;
};

export type ValidateTokenResult = {
    isValid: boolean;
    message?: string;
};

export type RefreshTokenResult = {
    accessToken?: string;
    refreshToken?: string;
} & ValidateTokenResult;

export type LoginResult = {
    isSuccess: boolean;
    userId?: number;
} & Omit<RefreshTokenResult, "isValid">;

export type LogoutResult = {
    isSuccess: boolean;
} & Omit<RefreshTokenResult, "isValid">;

export type UserAuthData = {
    id: number;
    username: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
    accessToken?: string;
    refreshToken?: string;
};

export type UserAuthResult = {
    isSuccess: boolean;
    message?: string;
    data?: UserAuthData;
};

export type ChangePasswordModel = {
    userId: number;
    oldPassword: string;
    newPassword: string;
};

export type ChangePasswordResult = {
    isSuccess: boolean;
    message?: string;
};
