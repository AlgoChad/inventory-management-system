import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import RestClient from "~/data/rest/RestClient";
import WarehouseTable from "./components/WarehouseTable";
import ToolsByProject from "./components/ToolsByProject";
import useFetchProjectSpecifics from "./hooks/useFetchProjectSpecifics";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    try {
        const getCheckins = async () => {
            return await restClient.Get<ApiResponse<CheckinModel[]>>(`/checkins/all`);
        };

        const getTools = async () => {
            return await restClient.Get<ApiResponse<ToolModel[]>>(`/tools/all`);
        };

        const [checkins, tools] = await Promise.all([getCheckins(), getTools()]);

        return json({ checkins, tools });
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const { checkins, tools } = useLoaderData<typeof loader>();
    const { paginatedGroups, currentPage, totalPages, handlePageChange, setPageSize } = useFetchProjectSpecifics({ checkins: checkins.data, tools: tools.data });

    return (
        <div className="flex justify-center items-center w-full bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-8xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Warehouse</h1>
                <div className="mb-8">
                    <WarehouseTable tools={tools.data} totalQuantity={tools.data.reduce((total: number, tool: ToolModel) => total + tool.quantity, 0)} />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Tools by Project</h2>
                <ToolsByProject
                    groupedTools={paginatedGroups}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
