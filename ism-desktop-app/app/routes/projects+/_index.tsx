import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import RestClient from "~/data/rest/RestClient";
import ProjectsTable from "./components/ProjectTable";
import CreateProjectForm from "./components/ProjectForm";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);
    const parsedArgs = SanitizeRequest(request);
    try {
        const getProjects = async () => {
            const projects = await restClient.Get<ApiResponse<PagedList<ProjectModel>>>(`/projects`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 10,
                column: parsedArgs.orderBy || "createdAt",
                direction: parsedArgs.orderDir || "asc",
            });

            if (!projects.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            const projectsTable: Datatable<ProjectModel> = {
                data: projects.data.list,
                pagination: {
                    page: projects.data.pagination.currentPage,
                    length: projects.data.pagination.pageSize,
                    totalCount: projects.data.pagination.totalItems,
                },
                defaultSort: {
                    id: "createdAt",
                    desc: "asc",
                },
            };

            return projectsTable;
        };

        return json(await getProjects());
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const projects = loaderData;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    return (
        <div className="p-4">
            <div className="m-4">
                <h1 className="text-2xl font-bold">Projects</h1>
            </div>
            <ScrollArea className="h-auto rounded-md border p-4">
                <div className="flex justify-end mb-4">
                    <Button className="m-2" onClick={openCreateModal}>
                        Create Project
                    </Button>
                </div>
                <ProjectsTable table={projects} />
            </ScrollArea>
            {isCreateModalOpen && (
                <CreateProjectForm
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                />
            )}
        </div>
    );
}
