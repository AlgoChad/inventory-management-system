import { ActionFunction, json } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";
import { CreateProjectModel } from "~/data/models/project/ProjectModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const projectDescription = formData.get("projectDescription");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    if (
        typeof projectDescription !== "string" || projectDescription.trim() === "" ||
        typeof startDate !== "string" || new Date(startDate).toString() === "Invalid Date" ||
        typeof endDate !== "string" || new Date(endDate).toString() === "Invalid Date"
    ) {
        return json(
            { success: false, error: "Invalid data provided" },
            { status: 400 }
        );
    }

    const newProject: CreateProjectModel = {
        projectDescription,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    };

    try {
        const response:any = await restClient.Post("/projects", { payload: newProject });
        return json({ success: true, project: response.data });
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
