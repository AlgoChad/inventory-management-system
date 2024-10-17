import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PersonnelModel, CreatePersonnelModel, UpdatePersonnelModel } from "~/data/models/personnel/PersonnelModel";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");

    if (typeof name !== "string" || !name) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const createPersonnelModel: CreatePersonnelModel = { name };

    try {
        const response: any = await restClient.Post("/personnel", {payload: createPersonnelModel});
        return redirect("/personnel");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
