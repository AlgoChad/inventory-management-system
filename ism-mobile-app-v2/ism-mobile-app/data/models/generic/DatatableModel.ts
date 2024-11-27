import { z } from "zod";

export const PaginationSchema = z.object({
    page: z.number(),
    length: z.number(),
    totalCount: z.number(),
});

export const DefaultSort = z.object({
    id: z.string(),
    desc: z.string(),
});

export type PaginationModel = z.infer<typeof PaginationSchema>;
export type DefaultSortModel = z.infer<typeof DefaultSort>;

export type Datatable<T> = {
    data: T[];
    pagination: PaginationModel;
    defaultSort: DefaultSortModel;
}
