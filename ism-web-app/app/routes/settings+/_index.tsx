import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import RestClient from "~/data/rest/RestClient";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { StatusTypeModel } from "~/data/models/status-type/StatusTypeModel";
import { promiseHash } from "remix-utils/promise";
import ConditionTypesTable from "./components/condition-types/ConditionTypesTable";
import { ScrollArea } from "~/components/ui/scroll-area";
import StatusTypesTable from "./components/status-types/StatusTypesTable";
import CreateConditionTypeForm from "./components/condition-types/ConditionTypeForm";
import { Button } from "~/components/ui/button";
import CreateStatusTypeForm from "./components/status-types/StatusTypeForm";

const API_BASE_URL = "http://localhost:3000/api"; // Base URL for your API
const API_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnaXZpbGxhbW9yMDFAZ21haWwuY29tIiwiaWF0IjoxNzI5MDg0MjI0LCJleHAiOjE3MjkwOTAyMjR9.jMeoZWLAKiLIVxzSD6Ox6-Qnz8uTJDK0Jzrh-LnyWe0"; // Your JWT token
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const loader: LoaderFunction = async ({ request }) => {
    const parsedArgs = SanitizeRequest(request);
    try {
        const getConditionTyles = async () => {
            const conditionTypes = await restClient.Get<
                ApiResponse<PagedList<ConditionTypeModel>>
            >(`/condition-types`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 10,
            });

            if (!conditionTypes.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            const conditionTypesTable: Datatable<ConditionTypeModel> = {
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

            return conditionTypesTable;
        };

        const getStatusTypes = async () => {
            const statusTypes = await restClient.Get<
                ApiResponse<PagedList<StatusTypeModel>>
            >(`/status-types`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 10,
            });

            if (!statusTypes.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            const statusTypesTable: Datatable<StatusTypeModel> = {
                data: statusTypes.data.list,
                pagination: {
                    page: statusTypes.data.pagination.currentPage,
                    length: statusTypes.data.pagination.pageSize,
                    totalCount: statusTypes.data.pagination.totalItems,
                },
                defaultSort: {
                    id: "createdAt",
                    desc: "asc",
                },
            };

            return statusTypesTable;
        };

        const data = await promiseHash({
            conditionTypes: getConditionTyles(),
            statusTypes: getStatusTypes()
        });

        console.log (data)

        return json({
            ...data,
        });
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
    const { conditionTypes, statusTypes } = loaderData;
    const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    const openConditionDialog = () => setIsConditionDialogOpen(true);
    const closeConditionDialog = () => setIsConditionDialogOpen(false);

    const openStatusDialog = () => setIsStatusDialogOpen(true);
    const closeStatusDialog = () => setIsStatusDialogOpen(false);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <ScrollArea style={{ width: '45%' }} className="h-auto rounded-md border p-4">
                    <Button style={{margin: '10px'}} onClick={openConditionDialog}>Create Condition Type</Button>
                    <ConditionTypesTable table={conditionTypes} />
                </ScrollArea>
                <ScrollArea style={{ width: '45%' }} className="h-auto rounded-md border p-4">
                    <Button style={{margin: '10px'}} onClick={openStatusDialog}>Create Status Type</Button>
                    <StatusTypesTable table={statusTypes} />
                </ScrollArea>
            </div>
            <div style={{ marginTop: '2rem' }}>
                <CreateConditionTypeForm isOpen={isConditionDialogOpen} onClose={closeConditionDialog} />
                <CreateStatusTypeForm isOpen={isStatusDialogOpen} onClose={closeStatusDialog} />
            </div>
        </div>
    );
}
