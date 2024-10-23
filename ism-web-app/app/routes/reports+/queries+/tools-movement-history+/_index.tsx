import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import RestClient from "~/data/rest/RestClient";
import useGroupedCheckins from "./hooks/useGroupedCheckins";
import Pagination from "~/components/app/custom/Pagination";
import ToolProjectsTable from "./components/ToolProjectsTable";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    try {
        const getCheckins = async () => {
            const checkins = await restClient.Get<ApiResponse<CheckinModel[]>>(
                `/checkins/all`
            );

            if (!checkins.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            return checkins;
        };

        return json({ checkins: await getCheckins() });
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const { paginatedCheckins, currentPage, totalPages, handlePageChange } = useGroupedCheckins(loaderData.checkins.data);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tool Movement History</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedCheckins.map(([toolId, { tool, projects }]) => (
                        <div key={toolId} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-lg font-semibold mb-2 text-gray-800">{tool.toolNumber} - {tool.toolName}</h2>
                            <ToolProjectsTable toolId={Number(toolId)} projects={projects} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}
