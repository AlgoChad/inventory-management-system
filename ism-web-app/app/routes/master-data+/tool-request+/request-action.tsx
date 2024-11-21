import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { CheckinModel, CreateCheckinModel } from "~/data/models/checkin/CheckinModel";
import RestClient from "~/data/rest/RestClient";
import { ToolModel, ToolRequest } from "~/data/models/tool/ToolModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";

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
        const requestResponse: ApiResponse<ToolRequest> = await restClient.Get(`/tool-request/request/${requestId}`);

        if (requestResponse.status !== "success") {
            throw new Error("Failed to fetch tool request");
        }

        const toolRequest = requestResponse.data;

        if (!toolRequest) {
            throw new Error("Tool request data is undefined");
        }

        if (actionType === "approve") {
            const projectResponse: ApiResponse<ProjectModel> = await restClient.Get(`/projects/${toolRequest.projectId}`);

            if (projectResponse.status !== "success") {
                throw new Error("Failed to fetch project data");
            }

            const project = projectResponse.data;

            if (!project) {
                throw new Error("Project data is undefined");
            }

            const createCheckinModel: CreateCheckinModel = {
                toolId: parseInt(toolRequest.toolId.toString(), 10),
                projectId: parseInt(toolRequest.projectId.toString(), 10),
                checkInDate: new Date(),
                checkInColor: project.color || "default",
                checkInQuantity: toolRequest.quantity,
                tool: undefined,
                project: undefined
            };

            const checkinResponse: ApiResponse<CheckinModel> = await restClient.Post("/checkins", { payload: createCheckinModel });

            if (checkinResponse.status !== "success") {
                throw new Error("Failed to create check-in");
            }

            const toolResult: ApiResponse<ToolModel> = await restClient.Get(`/tools/${toolRequest.toolId}`);

            if (toolResult.status !== "success") {
                throw new Error("Failed to fetch tool data");
            }

            const tool = toolResult.data;

            if (!tool) {
                throw new Error("Tool data is undefined");
            }

            const updatedTool = {
                quantity: tool.quantity - createCheckinModel.checkInQuantity,
            };

            const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${toolRequest.toolId}`, { payload: updatedTool });

            if (updateToolResponse.status !== "success") {
                throw new Error("Failed to update tool quantity");
            }

            const updateRequestResponse: ApiResponse<ToolRequest> = await restClient.Put(`/tool-request/update-request/${requestId}`, { payload: { status: "Approved" } });

            if (updateRequestResponse.status !== "success") {
                throw new Error("Failed to update tool request status");
            }

            return redirect("/master-data/tool-request");
        } else if (actionType === "reject") {
            const updateRequestResponse: ApiResponse<ToolRequest> = await restClient.Put(`/tool-request/update-request/${requestId}`, { payload: { status: "Rejected" } });

            if (updateRequestResponse.status !== "success") {
                throw new Error("Failed to update tool request status");
            }

            return redirect("/master-data/tool-request");
        } else if (actionType === "delete") {
            const checkinResponse: ApiResponse<CheckinModel> = await restClient.Get(`/checkins/${requestId}`);

            if (checkinResponse.status === "success") {
                const checkin = checkinResponse.data as CheckinModel;
                const toolResult: ApiResponse<ToolModel> = await restClient.Get(`/tools/${checkin.toolId}`);

                if (toolResult.status !== "success") {
                    throw new Error("Failed to fetch tool data");
                }

                const tool = toolResult.data;

                if (!tool) {
                    throw new Error("Tool data is undefined");
                }

                const updatedTool = {
                    quantity: tool.quantity + checkin.checkInQuantity,
                };

                const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${checkin.toolId}`, { payload: updatedTool });

                if (updateToolResponse.status !== "success") {
                    throw new Error("Failed to update tool quantity");
                }

                const deleteCheckinResponse: ApiResponse<any> = await restClient.Post(`/checkins/delete/${requestId}`, {});

                if (deleteCheckinResponse.status !== "success") {
                    throw new Error("Failed to delete check-in");
                }
            }

            const deleteRequestResponse: ApiResponse<any> = await restClient.Post(`/tool-request/delete-request/${requestId}`, {});

            if (deleteRequestResponse.status !== "success") {
                throw new Error("Failed to delete tool request");
            }

            return redirect("/master-data/tool-request");
        } else {
            return json({ error: "Invalid action type" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error during tool request action:", error);
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
