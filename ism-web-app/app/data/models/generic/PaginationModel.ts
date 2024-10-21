import { z } from "zod";

export const PaginationSchema = z.object({
    totalItems: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    pageSize: z.number(),
});


export type PaginationModel = z.infer<typeof PaginationSchema>;

export type PagedList<T> = {
    list: T[];
    pagination: PaginationModel;
}