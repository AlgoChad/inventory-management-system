import { ActionFunction, json, redirect } from "@remix-run/node";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");

    if (typeof name !== "string" || name.trim() === "") {
        return json(
            { success: false, error: "Invalid name provided" },
            { status: 400 }
        );
    }

    try {
        const response = await restClient.Post("/status-types", { payload: { name: name } });
        return redirect("/master-data/settings");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
