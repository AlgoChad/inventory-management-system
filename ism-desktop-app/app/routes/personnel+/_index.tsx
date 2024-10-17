import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { PagedList } from "~/data/models/generic/PaginationModel";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import RestClient from "~/data/rest/RestClient";
import PersonnelTable from "./components/PersonnelTable";
import CreatePersonnelForm from "./components/PersonnelForm";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const parsedArgs = SanitizeRequest(request);
    try {
        const getPersonnel = async () => {
            const personnel = await restClient.Get<
                ApiResponse<PagedList<PersonnelModel>>
            >(`/personnel`, {
                page: parsedArgs.page || 1,
                limit: parsedArgs.limit || 10,
                column: parsedArgs.orderBy || "createdAt",
                direction: parsedArgs.orderDir || "asc",
            });

            if (!personnel.data) {
                throw new Response("Failed to load data", { status: 500 });
            }

            const personnelTable: Datatable<PersonnelModel> = {
                data: personnel.data.list,
                pagination: {
                    page: personnel.data.pagination.currentPage,
                    length: personnel.data.pagination.pageSize,
                    totalCount: personnel.data.pagination.totalItems,
                },
                defaultSort: {
                    id: "createdAt",
                    desc: "asc",
                },
            };

            return personnelTable;
        };

        return json(await getPersonnel());
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const personnel = loaderData;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    return (
        <div className="p-4">
            <div className="m-4">
                <h1 className="text-2xl font-bold">Personnel</h1>
            </div>
            <ScrollArea className="h-auto rounded-md border p-4">
                <div className="flex justify-end mb-4">
                    <Button className="m-2" onClick={openCreateModal}>
                        Create Personnel
                    </Button>
                </div>
                <PersonnelTable table={personnel} />
            </ScrollArea>
            {isCreateModalOpen && (
                <CreatePersonnelForm
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                />
            )}
        </div>
    );
}
