import { ActionFunction, json, redirect } from "@remix-run/node";
import { RegisterModel } from "~/data/models/authentication/AuthenticationModel";
import RestClient from "~/data/rest/RestClient";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof name !== "string" || !name || typeof email !== "string" || !email || typeof password !== "string" || !password) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const registerModel: RegisterModel = { name, email, password };

    try {
        const response: any = await restClient.Post("/auth/register", { payload: registerModel });
        return redirect("/master-data/personnel");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
