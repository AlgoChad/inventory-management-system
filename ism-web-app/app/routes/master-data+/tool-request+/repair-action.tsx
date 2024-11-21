import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import RestClient from "~/data/rest/RestClient";
import { ToolModel, ToolRepairRequest } from "~/data/models/tool/ToolModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const requestId = formData.get("requestId");
    const actionType = formData.get("actionType");

    if (typeof requestId !== "string" || !requestId || typeof actionType !== "string" || !actionType) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
        const requestResponse: ApiResponse<ToolRepairRequest> = await restClient.Get(`/tool-request/repair-request/${requestId}`);

        if (requestResponse.status !== "success") {
            throw new Error("Failed to fetch tool repair request");
        }

        const toolRepairRequest = requestResponse.data;

        if (!toolRepairRequest) {
            throw new Error("Tool repair request data is undefined");
        }

        const toolResult: ApiResponse<ToolModel> = await restClient.Get(`/tools/${toolRepairRequest.toolId}`);

        if (toolResult.status !== "success") {
            throw new Error("Failed to fetch tool data");
        }

        const tool = toolResult.data;

        if (!tool) {
            throw new Error("Tool data is undefined");
        }

        if (actionType === "approve") {
            const updatedTool = {
                quantity: tool.quantity - toolRepairRequest.quantity,
            };

            const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${toolRepairRequest.toolId}`, { payload: updatedTool });

            if (updateToolResponse.status !== "success") {
                throw new Error("Failed to update tool quantity");
            }

            const updateRequestResponse: ApiResponse<ToolRepairRequest> = await restClient.Put(`/tool-request/update-repair-request/${requestId}`, { payload: { status: "In Repair" } });

            if (updateRequestResponse.status !== "success") {
                throw new Error("Failed to update tool repair request status");
            }

            return redirect("/master-data/tool-request");
        } else if (actionType === "complete") {
            const updatedTool = {
                quantity: tool.quantity + toolRepairRequest.quantity,
            };

            const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${toolRepairRequest.toolId}`, { payload: updatedTool });

            if (updateToolResponse.status !== "success") {
                throw new Error("Failed to update tool quantity");
            }

            const updateRequestResponse: ApiResponse<ToolRepairRequest> = await restClient.Put(`/tool-request/update-repair-request/${requestId}`, { payload: { status: "Repaired" } });

            if (updateRequestResponse.status !== "success") {
                throw new Error("Failed to update tool repair request status");
            }

            return redirect("/master-data/tool-request");
        } else if (actionType === "delete") {
            if (toolRepairRequest.status === "In Repair") {
                const updatedTool = {
                    quantity: tool.quantity + toolRepairRequest.quantity,
                };

                const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${toolRepairRequest.toolId}`, { payload: updatedTool });

                if (updateToolResponse.status !== "success") {
                    throw new Error("Failed to update tool quantity");
                }
            }

            const deleteRequestResponse: ApiResponse<any> = await restClient.Post(`/tool-request/delete-repair-request/${requestId}`, {});

            if (deleteRequestResponse.status !== "success") {
                throw new Error("Failed to delete tool repair request");
            }

            return redirect("/master-data/tool-request");
        } else {
            return json({ error: "Invalid action type" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error during tool repair request action:", error);
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
