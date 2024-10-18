import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import RestClient from "~/data/rest/RestClient";
import useFetchTools from "./hooks/useFetchTools";
import GroupedToolList from "./components/GroupedToolList";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

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
    const { paginatedGroups, currentPage, totalPages, handlePageChange, setPageSize } = useFetchTools(loaderData);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Tools</h1>
            <div className="">
                <GroupedToolList
                    groupedTools={paginatedGroups}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
