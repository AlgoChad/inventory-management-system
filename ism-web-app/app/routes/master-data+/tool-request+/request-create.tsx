import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import RestClient from "~/data/rest/RestClient";

export const action: ActionFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const formData = await request.formData();
    const toolId = formData.get("toolId");
    const quantity = formData.get("quantity");
    const projectId = formData.get("projectId");
    const personnelId = formData.get("personnelId");

    if (
        typeof toolId !== "string" ||
        typeof quantity !== "string" ||
        typeof projectId !== "string" ||
        typeof personnelId !== "string"
    ) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
        const response = await restClient.Post<ApiResponse<any>>("/tool-request/create-request", {payload: {
            toolId: parseInt(toolId, 10),
            quantity: parseInt(quantity, 10),
            projectId: parseInt(projectId, 10),
            personnelId: parseInt(personnelId, 10),
        }});

        if (response.status !== "success") {
            throw new Error("Failed to create tool request");
        }

        return redirect("/master-data/tool-request");
    } catch (error) {
        console.error("Error creating tool request:", error);
        return json({ error: (error as Error).message }, { status: 500 });
    }
};
