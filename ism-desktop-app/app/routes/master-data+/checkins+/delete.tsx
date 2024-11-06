import { ActionFunction, json, redirect } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { ToolModel } from "~/data/models/tool/ToolModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    if (typeof id !== "string" || !id) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
        const currentCheckinResponse: ApiResponse<any> = await restClient.Get(`/checkins/${id}`);
        if (currentCheckinResponse.status !== "success") {
            throw new Error("Failed to fetch current check-in details");
        }

        const quantityToReturn = currentCheckinResponse.data.checkInQuantity;
        const updateToolResponse: ApiResponse<ToolModel> = await restClient.Put(`/tools/${currentCheckinResponse.data.toolId}`, {
            payload: {
                quantity: quantityToReturn,
            }
        });

        if (updateToolResponse.status !== "success") {
            throw new Error("Failed to update tool quantity");
        }

        const deleteResponse: ApiResponse<any> = await restClient.Post(`/checkins/delete/${id}`, {});
        if (deleteResponse.status !== "success") {
            throw new Error("Failed to delete check-in");
        }
        
        return redirect("/master-data/checkins");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
