import { ActionFunction, json, redirect } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";
import { ApiResponse } from "~/data/models/generic/ApiModel";


export const action: ActionFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const formData = await request.formData();
    const toolId = formData.get("toolId");
    const description = formData.get("description");
    const personnelId = formData.get("personnelId");
    const quantity = formData.get("quantity");

    const images: { name: string; base64: string }[] = [];
    formData.forEach((value, key) => {
        if (key.startsWith("images[")) {
            const match = key.match(/images\[(\d+)\]\[(name|base64)\]/);
            if (match) {
                const index = parseInt(match[1], 10);
                const field = match[2];
                if (!images[index]) {
                    images[index] = { name: "", base64: "" };
                }
                images[index][field as "name" | "base64"] = value as string;
            }
        }
    });

    if (
        typeof toolId !== "string" ||
        typeof description !== "string" ||
        typeof personnelId !== "string" ||
        typeof quantity !== "string"
    ) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
        const response = await restClient.Post<ApiResponse<any>>("/tool-request/create-repair-request", {payload: {
            toolId: parseInt(toolId, 10),
            description,
            personnelId: parseInt(personnelId, 10),
            quantity: parseInt(quantity, 10),
            images,
        } });

        if (response.status !== "success") {
            throw new Error("Failed to create tool repair request");
        }

        return redirect("/master-data/tool-request");
    } catch (error) {
        console.error("Error creating tool repair request:", error);
        return json({ error: (error as Error).message }, { status: 500 });
    }
};
