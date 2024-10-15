import { generateCustomToken, generateRefreshToken, validateCustomToken, validateRefreshToken } from "@/src/core/helpers/TokenHelper";
import UserRepository from "@/src/data/repository/UserRepository";
import { Personnel, User } from "@prisma/client";
import { PrismaClient } from "@prisma/client/extension";

class Token {
    private repository: typeof UserRepository;
    
    constructor(repository: typeof UserRepository) {
        this.repository = repository;
    }

    public async GenerateTokenAsync(userId: number): Promise<string | undefined> {
        const userAuthAndData = await this.repository.GetEntityAsync(async (query: PrismaClient) => {
            return await query.findFirst({
                where: { id: userId },
                include: {
                    personnel: true
                }
            });
        });

        if (userAuthAndData) {
            const userData = userAuthAndData as unknown as Personnel

            if (!userData) return undefined;
            if (userAuthAndData?.refreshToken) return userAuthAndData.refreshToken;

            const token = generateCustomToken({
                id: userAuthAndData.id,
                userName: userData.name,
                email: userAuthAndData.username
            });

            const updatedEntry = await this.repository.UpdateAsync({
                id: userAuthAndData.id as number,
                data: { accessToken: token }
            });

            if (updatedEntry) {
                return token;
            }
        }

        return undefined;
    }

    public async GenerateRefreshTokenAsync(userId: number): Promise<string | undefined> {
        const userAuthAndData = await this.repository.GetEntityAsync(async (query: PrismaClient) => {
            return await query.findFirst({
                where: { id: userId },
                include: {
                    personnel: true
                }
            });
        });

        if (userAuthAndData) {
            const userData = userAuthAndData as unknown as Personnel

            if (!userData) return undefined;
            if (userAuthAndData?.refreshToken) return userAuthAndData.refreshToken;

            const token = generateRefreshToken({
                id: userAuthAndData.id,
                userName: userData.name,
                email: userAuthAndData.username
            });

            const updatedEntry = await this.repository.UpdateAsync({
                id: userAuthAndData.id as number,
                data: { refreshToken: token }
            });

            if (updatedEntry) {
                return token;
            }
        }

        return undefined;
    }

    public async ValidateAccessTokenAsync(token: string): Promise<[boolean, User | undefined]>{
        const isTokenValid = validateCustomToken(token);
        const userAuthData = await this.repository.GetEntityAsync(async (query: PrismaClient) => {
            return await query.findFirst({
                where: {
                    accessToken: token
                },
                include: {
                    personnel: true
                }
            });
        });

        return  [isTokenValid, userAuthData];
    }

    public async ValidateRefreshTokenAsync(token: string, refreshToken: string): Promise<[boolean, User | undefined]> {
        const isRefreshTokenValid = validateRefreshToken(refreshToken);

        const userAuthData = await this.repository.GetEntityAsync(async (query: PrismaClient) => {
            return await query.findFirst({
                where: {
                    accessToken: token,
                    refreshToken: refreshToken
                },
                include: {
                    personnel: true
                }
            });
        });

        return [isRefreshTokenValid, userAuthData];
    }
}

export default Token;
