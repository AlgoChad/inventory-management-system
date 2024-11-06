import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { FormDataToObject, SanitizeRequest } from "~/core/utils/helpers/RestHelpers";
import { ToolModel } from "~/data/models/tool/ToolModel";
import ToolTable from "./components/ToolsTable";
import CreateToolForm from "./components/ToolForm";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import IToolService from "~/core/services/tools/IToolService";
import ToolService from "~/core/services/tools/ToolService";

export const loader: LoaderFunction = async ({ request }) => {
    const toolService: IToolService = new ToolService();
    const parsedArgs = SanitizeRequest(request);

    try {
        const getToolsPageData = async () => {
            return await toolService.GetToolPageDataAsync({
                page: Number(parsedArgs.page) || 1,
                limit: Number(parsedArgs.limit) || 10,
                search: parsedArgs.search || "",
                column: parsedArgs.orderBy || "createdAt",
                direction: (parsedArgs.orderDir === "asc" || parsedArgs.orderDir === "desc") ? parsedArgs.orderDir : "asc",
            });
        };

        return json(await getToolsPageData());
    } catch (error) {
        throw new Response("Failed to load data", { status: 500 });
    }
};

export const action: ActionFunction = async ({ request }) => {
    const toolService: IToolService = new ToolService();

    const formData = await request.formData();
    const data = FormDataToObject(formData);

    const { toolName, quantity, conditionId, statusId, personnelId } = data;

    if (
        typeof toolName !== "string" || toolName.trim() === "" ||
        typeof quantity !== "string" || quantity.trim() === ""
    ) {
        return json(
            { success: false, error: "Invalid data provided" },
            { status: 400 }
        );
    }

    const toolNumber = toolName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase())
        .join("") + "-00" + Math.floor(Math.random() * 1000);

    try {
        const result: ToolModel = await toolService.CreateToolAsync({
            toolName,
            toolNumber,
            quantity: Number(quantity),
            conditionId: Number(conditionId),
            statusId: Number(statusId),
            personnelId: Number(personnelId),
        });

        if (!result) {
            return json(
                { success: false, error: "Failed to create tool" },
                { status: 400 }
            );
        }

        return json({ success: true, message: "Tool created successfully" });
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};

export default function Index() {
    const loaderData = useLoaderData<typeof loader>();
    const { tools, conditionTypes, statusTypes, personnel } =
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
                <div className="flex justify-between items-center m-4">
                    <Button className="m-2" onClick={openCreateModal}>
                        Create Tool
                    </Button>
                    <Form
                        method="GET"
                        className="flex items-center space-x-2 w-full max-w-md"
                    >
                        <div className="flex-grow">
                            <Label className="block text-sm font-medium text-gray-700">
                                Search
                            </Label>
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
                    </Form>
                </div>
                <ToolTable
                    table={tools}
                    conditionTypes={conditionTypes}
                    statusTypes={statusTypes}
                    personnel={personnel}
                />
            </ScrollArea>
            {isCreateModalOpen && (
                <CreateToolForm
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                    conditionTypes={conditionTypes}
                    statusTypes={statusTypes}
                    personnel={personnel}
                />
            )}
        </div>
    );
}
