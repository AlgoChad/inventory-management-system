import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { CheckinModel, UpdateCheckinModel } from "~/data/models/checkin/CheckinModel";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const toolId = formData.get("toolId");
    const projectId = formData.get("projectId");
    const checkInDate = formData.get("checkInDate");
    const checkOutDate = formData.get("checkOutDate");

    if (typeof id !== "string" || !id) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const updateCheckinModel: UpdateCheckinModel = {};
    if (typeof toolId === "string" && toolId) {
        updateCheckinModel.toolId = parseInt(toolId, 10);
    }
    if (typeof projectId === "string" && projectId) {
        updateCheckinModel.projectId = parseInt(projectId, 10);
    }
    if (typeof checkInDate === "string" && checkInDate) {
        updateCheckinModel.checkInDate = new Date(checkInDate);
    }
    if (typeof checkOutDate === "string" && checkOutDate) {
        updateCheckinModel.checkOutDate = new Date(checkOutDate);
    }

    try {
        const response: ApiResponse<CheckinModel> = await restClient.Put(`/checkins/${id}`, { payload: updateCheckinModel });
        return redirect("/master-data/checkins");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
