import { v4 as uuidv4 } from 'uuid';
import { 
    ApiResponse, 
    ApiResponseSchema, 
    ProblemDetail, 
    ProblemDetailSchema 
} from "../../data/models/generic/ApiModel";
import { z, ZodObject } from 'zod';

export const TrimSearchQueryValue = (searchQuery: Record<string, string>) => {
    for (const query in searchQuery) {
        searchQuery[query] = searchQuery[query].trim();
        if (searchQuery[query] === "" || 
            searchQuery[query] === undefined || 
            searchQuery[query] === null) {
            delete searchQuery[query];
        }
    }
    return searchQuery;
};

export const SanitizeRequest = (request: any) => {
    const url = new URL(request.url);
    const args: any = Object.fromEntries(url.searchParams);
    return TrimSearchQueryValue(args);
};

export const GenerateQueryString = (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            searchParams.append(key, value.toString());
        }
    });
    return searchParams.toString();
};

export const CreateResponse = <T>(
    status: "success" | "error", 
    message: string,
    error?: string, 
    data?: T | undefined
): ApiResponse<T> => {
    const response: ApiResponse<T> = { 
        status, 
        message,
        error,
        data
    };
    
    return response;
};

export const HandleError = (error: any, requestOrParams?: Request | any): ProblemDetail => {
    const traceId = uuidv4();
    console.error(`Error action cannot be done: ${error}`, { traceId });

    let instance: string;
    if (requestOrParams instanceof Request) {
        instance = requestOrParams.toString();
    } else {
        instance = JSON.stringify(requestOrParams);
    }

    const problemDetail: ProblemDetail = {
        status: 500,
        type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
        title: "Internal Server Error",
        detail: `Internal Server Error. ${error} \n Please contact support with the following reference code: ${traceId}`,
        instance: instance,
        traceId: traceId
    };

    ProblemDetailSchema.parse(problemDetail);
    return problemDetail;
};
