import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { PersonnelModel, UpdatePersonnelModel } from "~/data/models/personnel/PersonnelModel";
import RestClient from "~/data/rest/RestClient";
import { ChangePasswordModel } from "~/data/models/authentication/AuthenticationModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (typeof id !== "string" || typeof name !== "string" || !id || !name) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    const updatePersonnelModel: UpdatePersonnelModel = { name };

    try {
        await restClient.Put(`/personnel/${id}`, { payload: updatePersonnelModel });

        if (newPassword && confirmPassword && newPassword === confirmPassword) {
            const changePasswordModel: ChangePasswordModel = { 
                userId: parseInt(id), 
                oldPassword: oldPassword as string, 
                newPassword: newPassword as string 
            };
            await restClient.Post(`/auth/change-password`, { payload: changePasswordModel });
        }

        return redirect("/master-data/personnel");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
