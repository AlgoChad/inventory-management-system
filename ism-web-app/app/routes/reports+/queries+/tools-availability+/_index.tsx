import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import RestClient from "~/data/rest/RestClient";
import useFetchToolsByStatusAndCondition from "./hooks/useFetchToolsByStatusAndCondition";
import Pagination from "~/components/app/custom/Pagination";
import GroupedToolCards from "./components/GroupedToolCards";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const parsedArgs = SanitizeRequest(request);
    try {
        const getTools = async () => {
            const tools = await restClient.Get<ApiResponse<ToolModel[]>>(`/tools/all`);

            if (!tools.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            return tools;
        };

        return json({ tools: await getTools() });
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const { 
        paginatedStatusGroups, 
        paginatedConditionGroups, 
        statusPage, 
        conditionPage, 
        totalStatusPages, 
        totalConditionPages, 
        handleStatusPageChange, 
        handleConditionPageChange, 
        setPageSize 
    } = useFetchToolsByStatusAndCondition(loaderData);

    const [view, setView] = useState<'status' | 'condition'>('status');

    const toggleView = () => {
        setView((prevView) => (prevView === 'status' ? 'condition' : 'status'));
    };

    return (
        <div className="p-2">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Tools by Status and Condition</h1>
            <div className="h-[calc(100vh-200px)] overflow-y-auto bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <Button 
                        onClick={toggleView} 
                    >
                        {view === 'status' ? 'Show by Condition' : 'Show by Status'}
                    </Button>
                </div>
                {view === 'status' ? (
                    <GroupedToolCards groupedTools={paginatedStatusGroups} title="Grouped by Status" />
                ) : (
                    <GroupedToolCards groupedTools={paginatedConditionGroups} title="Grouped by Condition" />
                )}
            </div>
            {view === 'status' ? (
                <Pagination
                    currentPage={statusPage}
                    totalPages={totalStatusPages}
                    onPageChange={handleStatusPageChange}
                />
            ) : (
                <Pagination
                    currentPage={conditionPage}
                    totalPages={totalConditionPages}
                    onPageChange={handleConditionPageChange}
                />
            )}
        </div>
    );
}
