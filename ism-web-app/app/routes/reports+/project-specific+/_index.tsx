import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import RestClient from "~/data/rest/RestClient";
import Pagination from "@/app/components/app/custom/Pagination";
import useFetchProjects from "./hooks/useFetchProjects";
import ProjectToolsTable from "./components/ProjectToolsTable";
import { Badge } from "~/components/ui/badge";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const parsedArgs = SanitizeRequest(request);
    try {
        const getProjects = async () => {
            const projects = await restClient.Get<ApiResponse<PagedList<ProjectModel>>>(`/projects`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 6,
                column: parsedArgs.orderBy || "createdAt",
                direction: parsedArgs.orderDir || "asc",
            });

            if (!projects.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            return projects;
        };

        return json({ projects: await getProjects() });
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const { 
        projects, 
        pagination, 
        totalPages, 
        fetchProjects, 
        setPagination 
    } = useFetchProjects(loaderData);

    const handlePageChange = useCallback((page: number) => {
        setPagination((prev) => ({ ...prev, currentPage: page }));
        fetchProjects(page, pagination.pageSize);
    }, [setPagination, fetchProjects, pagination.pageSize]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center text-black">Projects</h1>
            <div className="h-[calc(100vh-200px)] overflow-y-auto bg-white p-4 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project: ProjectModel) => (
                        <div key={project.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-xl font-semibold mb-2 text-black">{project.projectName}</h2>
                            <p className="text-black mb-1">
                                <span className="font-semibold">Start Date:</span> <Badge variant="default">{new Date(project.startDate).toDateString()}</Badge>
                            </p>
                            <p className="text-black mb-2">
                                <span className="font-semibold">End Date:</span> <Badge variant="default">{new Date(project.endDate).toDateString()}</Badge>
                            </p>
                            <h3 className="text-lg font-semibold mt-2 mb-1 text-black">Tools</h3>
                            <ProjectToolsTable tools={project.tools} />
                        </div>
                    ))}
                </div>
            </div>
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
