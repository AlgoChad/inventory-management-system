import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import RestClient from "~/data/rest/RestClient";
import CheckinTable from "./components/CheckInTable";
import CreateCheckinForm from "./components/CheckinForm";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const parsedArgs = SanitizeRequest(request);

    const getCheckins = async () => {
        const checkins = await restClient.Get<
            ApiResponse<PagedList<CheckinModel>>
        >(`/checkins`, {
            page: parsedArgs.page || 1,
            limit: parsedArgs.limit || 10,
            column: parsedArgs.orderBy || "createdAt",
            direction: parsedArgs.orderDir || "asc",
        });

        if (!checkins.data) {
            throw new Response("Failed to load data", { status: 500 });
        }

        const checkinTable: Datatable<CheckinModel> = {
            data: checkins.data.list,
            pagination: {
                page: checkins.data.pagination.currentPage,
                length: checkins.data.pagination.pageSize,
                totalCount: checkins.data.pagination.totalItems,
            },
            defaultSort: {
                id: "createdAt",
                desc: "asc",
            },
        };

        return checkinTable;
    };

    const getProjects = async () => {
        const projects = await restClient.Get<ApiResponse<ProjectModel[]>>(
            `/projects/all`
        );

        return projects.data;
    };

    const getTools = async () => {
        const tools = await restClient.Get<ApiResponse<ToolModel[]>>(
            `/tools/all`
        );

        return tools.data;
    };

    const [checkins, projects, tools] = await Promise.all([
        getCheckins(),
        getProjects(),
        getTools(),
    ]);

    return json({ checkins, projects, tools });
};

export default function CheckinsIndex() {
    const loaderData = useLoaderData<typeof loader>();
    const { checkins, projects, tools } = loaderData;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    return (
        <div className="p-4">
            <div className="m-4">
                <h1 className="text-2xl font-bold">Check-Ins</h1>
            </div>
            <ScrollArea className="h-auto rounded-md border p-4 bg-white shadow-md">
                <div className="flex justify-end mb-4">
                    <Button className="m-2" onClick={openCreateModal}>
                        Create Check-In
                    </Button>
                </div>
                <CheckinTable table={checkins} projects={projects} tools={tools} />
            </ScrollArea>
            {isCreateModalOpen && (
                <CreateCheckinForm
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                    projects={projects}
                    tools={tools}
                />
            )}
        </div>
    );
}
