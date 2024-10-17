import { ActionFunction, json, redirect } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");

    if (typeof id !== "string" || id.trim() === "") {
        return json(
            { success: false, error: "Invalid ID provided" },
            { status: 400 }
        );
    }

    try {
        const response = await restClient.Post(`/projects/delete/${id}`, {});
        return redirect("/projects");
    } catch (error) {
        console.log("delete project response", error);
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
