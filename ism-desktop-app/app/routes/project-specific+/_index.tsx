import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import RestClient from "~/data/rest/RestClient";

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

            const data: Datatable<ProjectModel> = {
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

            return
        };

        return json({ projects: await getProjects() });
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

// export default function Projects() {
//     const { projects } = useLoaderData<typeof loader>();

//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold mb-4">Projects</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {projects.data.map((project: ProjectModel) => (
//                     <div key={project.id} className="bg-white p-4 rounded-lg shadow-lg">
//                         <h2 className="text-xl font-semibold mb-2">{project.projectDescription}</h2>
//                         <p className="text-gray-600 mb-2">
//                             Start Date: {new Date(project.startDate).toLocaleDateString()}
//                         </p>
//                         <p className="text-gray-600 mb-2">
//                             End Date: {new Date(project.endDate).toLocaleDateString()}
//                         </p>
//                         <h3 className="text-lg font-semibold mt-4 mb-2">Tools</h3>
//                         {project.tools.length > 0 ? (
//                             <table className="min-w-full bg-white border">
//                                 <thead>
//                                     <tr>
//                                         <th className="py-2 px-4 border">Tool Number</th>
//                                         <th className="py-2 px-4 border">Description</th>
//                                         <th className="py-2 px-4 border">Quantity</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {project.tools.map((tool: ToolModel) => (
//                                         <tr key={tool.id}>
//                                             <td className="border px-4 py-2">{tool.toolNumber}</td>
//                                             <td className="border px-4 py-2">{tool.toolDescription}</td>
//                                             <td className="border px-4 py-2">{tool.quantity}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         ) : (
//                             <p className="text-gray-600">No tools available for this project.</p>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
