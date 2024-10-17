import { Token } from "./TokenModel";
import { z, ZodType } from "zod";

export const ProblemDetailSchema = z.object({
    type: z.string().url(),
    title: z.string(),
    status: z.number(),
    detail: z.string().optional(),
    instance: z.string().url().optional(),
    traceId: z.string(),
});

export const ApiResponseSchema = <T extends ZodType<any, any>>(dataSchema: T) => z.object({
    status: z.enum(["success", "error"]),
    message: z.string(),
    error: z.string().optional(),
    data: dataSchema.optional()
});

export type ProblemDetail = z.infer<typeof ProblemDetailSchema>;

export type ApiResponse<T> = {
    status: "success" | "error";
    message: string;
    error?: string;
    data?: T;
};

export type ApiRequest<Q = {}, P = {}, PL = {}, A = Token> = {
    query: Q;
    params: P;
    body: {
        payload: PL;
    };
    headers: {
        accesstoken: A;
    }
}
