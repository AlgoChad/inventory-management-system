import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import RestClient from "~/data/rest/RestClient";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { Datatable } from "~/data/models/generic/DatatableModel";

import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { ToolModel, ToolRepairRequest, ToolRequest } from "~/data/models/tool/ToolModel";
import ToolRequestsTable from "./components/ToolRequestsTable";
import ToolRepairRequestsTable from "./components/ToolRepairRequestsTable";
import CreateToolRequestForm from "./components/CreateToolRequestForm";
import CreateToolRepairRequestForm from "./components/CreateToolRepairRequestForm";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";


export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const parsedArgs = SanitizeRequest(request);
    try {
        const getToolRequests = async () => {
            const toolRequests = await restClient.Get<
                ApiResponse<PagedList<ToolRequest>>
            >(`/tool-request/requests`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 10,
                column: parsedArgs.orderBy || "createdAt",
                direction: parsedArgs.orderDir || "asc",
            });

            if (!toolRequests.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            const toolRequestsTable: Datatable<ToolRequest> = {
                data: toolRequests.data.list,
                pagination: {
                    page: toolRequests.data.pagination.currentPage,
                    length: toolRequests.data.pagination.pageSize,
                    totalCount: toolRequests.data.pagination.totalItems,
                },
                defaultSort: {
                    id: "createdAt",
                    desc: "asc",
                },
            };

            return toolRequestsTable;
        };

        const getToolRepairRequests = async () => {
            const toolRepairRequests = await restClient.Get<
                ApiResponse<PagedList<ToolRepairRequest>>
            >(`/tool-request/repair-requests`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 10,
                column: parsedArgs.orderBy || "createdAt",
                direction: parsedArgs.orderDir || "asc",
            });

            if (!toolRepairRequests.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            const toolRepairRequestsTable: Datatable<ToolRepairRequest> = {
                data: toolRepairRequests.data.list,
                pagination: {
                    page: toolRepairRequests.data.pagination.currentPage,
                    length: toolRepairRequests.data.pagination.pageSize,
                    totalCount: toolRepairRequests.data.pagination.totalItems,
                },
                defaultSort: {
                    id: "createdAt",
                    desc: "asc",
                },
            };

            return toolRepairRequestsTable;
        };

        const getTools = async () => {
            const tools = await restClient.Get<ApiResponse<ToolModel[]>>(`/tools/all`);

            if (!tools.data) {
                throw new Response("Failed to load tools", { status: 500 });
            }

            return tools.data;
        };

        const getPersonnel = async () => {
            const personnel = await restClient.Get<ApiResponse<PersonnelModel[]>>(`/personnel/all`);

            if (!personnel.data) {
                throw new Response("Failed to load personnel", { status: 500 });
            }

            return personnel.data;
        };

        const getProjects = async () => {
            const projects = await restClient.Get<ApiResponse<ProjectModel[]>>(`/projects/all`);

            if (!projects.data) {
                throw new Response("Failed to load projects", { status: 500 });
            }

            return projects.data;
        }

        const [toolRequests, toolRepairRequests, tools, personnel, projects] = await Promise.all([
            getToolRequests(),
            getToolRepairRequests(),
            getTools(),
            getPersonnel(),
            getProjects()
        ]);

        return json({
            toolRequests,
            toolRepairRequests,
            tools,
            personnel,
            projects
        });
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const { toolRequests, toolRepairRequests, tools, personnel, projects } = loaderData;
    const [isToolRequestDialogOpen, setIsToolRequestDialogOpen] = useState(false);
    const [isToolRepairRequestDialogOpen, setIsToolRepairRequestDialogOpen] = useState(false);

    const openToolRequestDialog = () => setIsToolRequestDialogOpen(true);
    const closeToolRequestDialog = () => setIsToolRequestDialogOpen(false);

    const openToolRepairRequestDialog = () => setIsToolRepairRequestDialogOpen(true);
    const closeToolRepairRequestDialog = () => setIsToolRepairRequestDialogOpen(false);

    return (
        <div className="p-4">
            <div className="m-4">
                <h1 className="text-2xl font-semibold">Tool Requests and Repairs</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <ScrollArea className="w-full md:w-1/2 h-auto rounded-md border p-4 bg-white shadow-md">
                    <div className="flex justify-end mb-4">
                        <Button className="m-2" onClick={openToolRequestDialog}>
                            Create Tool Request
                        </Button>
                    </div>
                    <ToolRequestsTable table={toolRequests} />
                </ScrollArea>
                <ScrollArea className="w-full md:w-1/2 h-auto rounded-md border p-4 bg-white shadow-md">
                    <div className="flex justify-end mb-4">
                        <Button className="m-2" onClick={openToolRepairRequestDialog}>
                            Create Tool Repair Request
                        </Button>
                    </div>
                    <ToolRepairRequestsTable table={toolRepairRequests} />
                </ScrollArea>
            </div>
            <div className="mt-8">
                <CreateToolRequestForm
                    isOpen={isToolRequestDialogOpen}
                    onClose={closeToolRequestDialog}
                    tools={tools}
                    projects={projects}
                    personnel={personnel}
                />
                <CreateToolRepairRequestForm
                    isOpen={isToolRepairRequestDialogOpen}
                    onClose={closeToolRepairRequestDialog}
                    tools={tools}
                    personnel={personnel}
                />
            </div>
        </div>
    );
}
