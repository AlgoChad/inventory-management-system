import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { CheckinModel, UpdateCheckinModel } from "~/data/models/checkin/CheckinModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import RestClient from "~/data/rest/RestClient";
import { ProjectModel } from "~/data/models/project/ProjectModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const toolId = formData.get("toolId");
    const projectId = formData.get("projectId");
    const checkInDate = formData.get("checkInDate");
    const checkInQuantity = formData.get("checkInQuantity");

    if (
        typeof id !== "string" || !id ||
        typeof toolId !== "string" || !toolId ||
        typeof projectId !== "string" || !projectId ||
        typeof checkInDate !== "string" || !checkInDate ||
        typeof checkInQuantity !== "string" || !checkInQuantity
    ) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const newCheckInQuantity = parseInt(checkInQuantity, 10);

    try {
        const currentCheckinResponse: ApiResponse<CheckinModel> = await restClient.Get(`/checkins/${id}`);
        if (currentCheckinResponse.status !== "success") {
            throw new Error("Failed to fetch current check-in details");
        }
        const currentCheckin = currentCheckinResponse.data;
        if (!currentCheckin) {
            throw new Error("Current check-in data is undefined");
        }
        const previousCheckInQuantity = currentCheckin.checkInQuantity;

        const quantityDifference = newCheckInQuantity - previousCheckInQuantity;

        const toolResponse: ApiResponse<ToolModel> = await restClient.Get(`/tools/${toolId}`);
        if (toolResponse.status !== "success") {
            throw new Error("Failed to fetch tool details");
        }
        const tool = toolResponse.data;

        if (!tool) {
            throw new Error("Tool data is undefined");
        }

        const updatedToolQuantity = tool.quantity - quantityDifference;
        const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${toolId}`, {
            payload: {
                quantity: updatedToolQuantity,
            },
        });
        if (updateToolResponse.status !== "success") {
            throw new Error("Failed to update tool quantity");
        }

        const newProject: ApiResponse<ProjectModel> = await restClient.Get(`/projects/${projectId}`);

        const updateCheckinModel: UpdateCheckinModel = {
            toolId: parseInt(toolId, 10),
            projectId: parseInt(projectId, 10),
            checkInDate: new Date(checkInDate),
            checkInColor: newProject.data?.color || "",
            checkInQuantity: newCheckInQuantity,
        };

        const updateCheckinResponse: ApiResponse<CheckinModel> = await restClient.Put(`/checkins/${id}`, { payload: updateCheckinModel });
        if (updateCheckinResponse.status !== "success") {
            throw new Error("Failed to update check-in details");
        }

        return redirect("/master-data/checkins");
    } catch (error) {
        console.error("Error during check-in update or tool quantity adjustment:", error);
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
