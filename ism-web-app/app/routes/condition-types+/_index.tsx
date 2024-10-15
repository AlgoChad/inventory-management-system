import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RestClient from "~/data/rest/RestClient";
import { DataTable } from "@/app/components/app/custom/Datatable";
import { ColumnDef } from "@tanstack/react-table";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";

const API_BASE_URL = "http://localhost:3000/api"; // Base URL for your API
const API_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnaXZpbGxhbW9yMDFAZ21haWwuY29tIiwiaWF0IjoxNzI5MDA2Mjk2LCJleHAiOjE3MjkwMTIyOTZ9.7zgiD7579MozwOXQoKnocxSISoYcmfoN-qXeMLGDo1w"; // Your JWT token
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const loader: LoaderFunction = async ({ request }) => {
    const parsedArgs = SanitizeRequest(request);
    try {
        const conditionTypes = await restClient.Get<
            ApiResponse<PagedList<ConditionTypeModel>>
        >(`/condition-types`, {
            page: parsedArgs.pageNumber || 1,
            limit: parsedArgs.pageLength || 1,
        });

        if (!conditionTypes.data) {
            throw new Response("Failed to load data", { status: 500 });
        }

        const data = {
            data: conditionTypes.data.list,
            pagination: {
                page: conditionTypes.data.pagination.currentPage,
                length: conditionTypes.data.pagination.pageSize,
                totalCount: conditionTypes.data.pagination.totalItems,
            },
            defaultSort: {
                id: "createdAt",
                desc: "asc",
            },
        };

        return json(data);
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const newConditionType = {
        name: formData.get("name"),
    };

    try {
        await restClient.Post("/condition-types", newConditionType);
        return json({ success: true });
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const { data, pagination, defaultSort } = loaderData;

    const columns: ColumnDef<ConditionTypeModel>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Name
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return <div className="text-center">{rowValue.name}</div>;
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Created At
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        {new Date(
                            rowValue.createdAt as unknown as string
                        ).toLocaleDateString()}
                    </div>
                );
            },
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Updated At
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        {new Date(
                            rowValue.updatedAt as unknown as string
                        ).toLocaleDateString()}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <DataTable
                columns={columns}
                tableData={data}
                pagination={pagination}
                defaultSort={defaultSort}
            />
        </div>
    );
}
