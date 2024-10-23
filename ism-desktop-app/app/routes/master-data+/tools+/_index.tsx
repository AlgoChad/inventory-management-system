import { json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import RestClient from "~/data/rest/RestClient";
import ToolTable from "./components/ToolsTable";
import CreateToolForm from "./components/ToolForm";
import { Button } from "~/components/ui/button";
import { StatusTypeModel } from "~/data/models/status-type/StatusTypeModel";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const parsedArgs = SanitizeRequest(request);
    console.log(parsedArgs);

    try {
        const getTools = async () => {
            const tools = await restClient.Get<
                ApiResponse<PagedList<ToolModel>>
            >(`/tools`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 10,
                search: parsedArgs.search || "",
                column: parsedArgs.orderBy || "createdAt",
                direction: parsedArgs.orderDir || "asc",
            });

            if (!tools.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            const toolsTable: Datatable<ToolModel> = {
                data: tools.data.list,
                pagination: {
                    page: tools.data.pagination.currentPage,
                    length: tools.data.pagination.pageSize,
                    totalCount: tools.data.pagination.totalItems,
                },
                defaultSort: {
                    id: "createdAt",
                    desc: "asc",
                },
            };

            return toolsTable;
        };

        const getConditionTypes = async () => {
            const conditionTypes = await restClient.Get<
                ApiResponse<ConditionTypeModel[]>
            >(`/condition-types/all`);

            return conditionTypes;
        };

        const getStatusTypes = async () => {
            const statusTypes = await restClient.Get<
                ApiResponse<StatusTypeModel[]>
            >(`/status-types/all`);

            return statusTypes;
        };


        const getPersonnel = async () => {
            const personnel = await restClient.Get<
                ApiResponse<PagedList<PersonnelModel[]>>
            >(`/personnel/all`);

            return personnel;
        };

        const [tools, conditionTypes, statusTypes, personnel] =
            await Promise.all([
                getTools(),
                getConditionTypes(),
                getStatusTypes(),
                getPersonnel(),
            ]);

        return json({
            tools,
            conditionTypes,
            statusTypes,
            personnel,
        });
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const { tools, conditionTypes, statusTypes, projects, personnel } =
        loaderData;
  
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    return (
        <div className="p-4">
            <div className="m-4">
                <h1 className="text-2xl font-bold">Tools</h1>
            </div>
            <ScrollArea className="h-auto rounded-md border p-4 bg-white shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <Button className="m-2" onClick={openCreateModal}>
                        Create Tool
                    </Button>
                    <Form method="GET" className="w-full max-w-md border p-5 rounded-md">
                        <div className="flex items-center space-x-2">
                            <div className="flex-grow">
                                <Label className="block text-sm font-medium text-gray-700">Search</Label>
                                <Input
                                    className="mt-1 block w-full text-xs h-[30px] px-2 py-1 border rounded-md"
                                    name="search"
                                    type="text"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 mt-6"
                                type="submit"
                            >
                                <Search className="h-3.5 w-3.5" />
                                Search
                            </Button>
                        </div>
                    </Form>
                </div>
                <ToolTable
                    table={tools}
                    conditionTypes={conditionTypes.data}
                    statusTypes={statusTypes.data}
                    personnel={personnel.data}
                />
            </ScrollArea>
            {isCreateModalOpen && (
                <CreateToolForm
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                    conditionTypes={conditionTypes.data}
                    statusTypes={statusTypes.data}
                    personnel={personnel.data}
                />
            )}
        </div>
    );
}
