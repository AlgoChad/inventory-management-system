import { ActionFunction, json, redirect } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";
import { UpdateProjectModel } from "~/data/models/project/ProjectModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const projectName = formData.get("projectName");
    const projectDescription = formData.get("projectDescription");
    const color = formData.get("color");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");

    if (
        typeof id !== "string" || id.trim() === "" ||
        typeof projectName !== "string" || projectName.trim() === "" ||
        typeof projectDescription !== "string" || projectDescription.trim() === "" ||
        typeof startDate !== "string" || new Date(startDate).toString() === "Invalid Date" ||
        typeof endDate !== "string" || new Date(endDate).toString() === "Invalid Date"
    ) {
        return json(
            { success: false, error: "Invalid data provided" },
            { status: 400 }
        );
    }

    const updatedProject: UpdateProjectModel = {
        projectName,
        color: color?.toString() || "",
        projectDescription,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    };

    try {
        const response: any = await restClient.Put(`/projects/${id}`, { payload: updatedProject });
        return redirect("/master-data/projects");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
