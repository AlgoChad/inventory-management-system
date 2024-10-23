import { ActionFunction, json, redirect } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const toolName = formData.get("toolName");
    const quantity = formData.get("quantity");
    const conditionId = formData.get("conditionId");
    const statusId = formData.get("statusId");
    const projectId = formData.get("projectId");
    const personnelId = formData.get("personnelId");

    if (
        typeof id !== "string" || id.trim() === "" ||
        typeof toolName !== "string" || toolName.trim() === "" ||
        typeof quantity !== "string" || quantity.trim() === ""
    ) {
        return json(
            { success: false, error: "Invalid data provided" },
            { status: 400 }
        );
    }

    try {
        const response = await restClient.Put(`/tools/${id}`, {
            payload: {
                toolName,
                quantity: Number(quantity),
                conditionId: conditionId ? Number(conditionId) : undefined,
                statusId: statusId ? Number(statusId) : undefined,
                projectId: projectId ? Number(projectId) : undefined,
                personnelId: personnelId ? Number(personnelId) : undefined,
            }
        });
        return redirect("/master-data/tools");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
