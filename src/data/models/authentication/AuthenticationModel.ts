export type LoginModel = {
    userName?: string;
    email?: string;
    password: string;
  }
  
  export type RegisterModel = {
    name: string;
    userName: string;
    email: string;
    password: string;
  }
  
  export type LogoutModel = {
    userName: string;
    accessToken: string;
  }
  
  export type RefreshTokenModel = {
    accessToken: string;
    refreshToken: string;
  }
  
  export type ValidateTokenResult = {
    isValid: boolean;
    message?: string;
  }
  
  export type RefreshTokenResult = {
    accessToken?: string;
    refreshToken?: string;
  } & ValidateTokenResult;
  
  export type LoginResult = {
    isSuccess: boolean;
    userGuid?: string;
  } & Omit<RefreshTokenResult, 'isValid'>;
  
  export type LogoutResult = {
    isSuccess: boolean;
  } & Omit<RefreshTokenResult, 'isValid'>;
  
  export type UserAuthData = {
    id: number;
    userId: number;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
    provider?: string;
    providerAccountId?: string;
    accessToken?: string;
    refreshToken?: string;
  }
  
  export type UserAuthResult = {
    isSuccess: boolean;
    message?: string;
    data?: UserAuthData;
  }