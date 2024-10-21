import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { CheckinModel, CreateCheckinModel } from "~/data/models/checkin/CheckinModel";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const toolId = formData.get("toolId");
    const projectId = formData.get("projectId");
    const checkInDate = formData.get("checkInDate");
    const checkOutDate = formData.get("checkOutDate");

    if (
        typeof toolId !== "string" || !toolId ||
        typeof projectId !== "string" || !projectId ||
        typeof checkInDate !== "string" || !checkInDate
    ) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const createCheckinModel: CreateCheckinModel = {
        toolId: parseInt(toolId, 10),
        projectId: parseInt(projectId, 10),
        checkInDate: new Date(checkInDate),
        checkOutDate: checkOutDate ? new Date(checkOutDate as string) : undefined,
        tool: undefined,
        project: undefined
    };

    try {
        const response: ApiResponse<CheckinModel> = await restClient.Post("/checkins", { payload: createCheckinModel });
        return redirect("/master-data/checkins");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
