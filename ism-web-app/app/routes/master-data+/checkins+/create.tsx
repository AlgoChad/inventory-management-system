import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { CheckinModel, CreateCheckinModel } from "~/data/models/checkin/CheckinModel";
import RestClient from "~/data/rest/RestClient";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const toolId = formData.get("toolId");
    const projectId = formData.get("projectId");
    const checkInDate = formData.get("checkInDate");
    const checkInColor = formData.get("checkInColor");

    if (
        typeof toolId !== "string" || !toolId ||
        typeof projectId !== "string" || !projectId ||
        typeof checkInDate !== "string" || !checkInDate ||
        typeof checkInColor !== "string" || !checkInColor
    ) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const createCheckinModel: CreateCheckinModel = {
        toolId: parseInt(toolId, 10),
        projectId: parseInt(projectId, 10),
        checkInDate: new Date(checkInDate),
        checkInColor: checkInColor,
        checkInQuantity: parseInt(formData.get("checkInQuantity") as string, 10),
        tool: undefined,
        project: undefined
    };

    try {
        const response: ApiResponse<CheckinModel> = await restClient.Post("/checkins", { payload: createCheckinModel });
    
        if (response.status !== "success") {
            throw new Error("Failed to create check-in");
        }
    
        const toolResult: ApiResponse<ToolModel> = await restClient.Get(`/tools/${toolId}`);
    
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
    
        const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${toolId}`, { payload: updatedTool });
    
        if (updateToolResponse.status !== "success") {
            throw new Error("Failed to update tool quantity");
        }
    
        return redirect("/master-data/checkins");
    } catch (error) {
        console.error("Error during check-in creation or tool update:", error);
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
