import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import RestClient from "~/data/rest/RestClient";
import useGroupedCheckins from "./hooks/useGroupedCheckins";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { useState } from "react";
import Pagination from "~/components/app/custom/Pagination";


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
        <div className="p-2">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Tool Movement History</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {paginatedCheckins.map(([toolId, { tool, projects }]) => (
                        <div key={toolId} className="bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-lg font-semibold mb-2 text-black">{tool.toolNumber} - {tool.toolDescription}</h2>
                            <div className="space-y-1">
                                {projects.map((project: ProjectModel, index: number) => (
                                    <div key={index} className="bg-gray-100 p-1 rounded-lg shadow-sm">
                                        <p className="text-xs text-black"><span className="font-semibold">Project:</span> {project.projectDescription}</p>
                                        <p className="text-xs text-black"><span className="font-semibold">Start Date:</span> {new Date(project.startDate).toDateString()}</p>
                                        <p className="text-xs text-black"><span className="font-semibold">End Date:</span> {new Date(project.endDate).toDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
