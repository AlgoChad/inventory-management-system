import { ActionFunction, json, redirect } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";
import { CreateProjectModel } from "~/data/models/project/ProjectModel";
import { ApiResponse } from "~/data/models/generic/ApiModel";

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
        const response: any = await restClient.Post(`/personnel/delete/${id}`, {});
        return redirect("/personnel");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
