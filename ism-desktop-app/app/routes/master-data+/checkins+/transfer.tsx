import { ActionFunction, json, redirect } from "@remix-run/node";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { CheckinModel, CreateCheckinModel, UpdateCheckinModel } from "~/data/models/checkin/CheckinModel";
import RestClient from "~/data/rest/RestClient";
import { ToolModel } from "~/data/models/tool/ToolModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const checkInId = formData.get("checkInId");
    const projectId = formData.get("projectId");
    const transferQuantity = formData.get("transferQuantity");

    if (
        typeof checkInId !== "string" || !checkInId ||
        typeof projectId !== "string" || !projectId ||
        typeof transferQuantity !== "string" || !transferQuantity
    ) {
        return json({ error: "Invalid form data" }, { status: 400 });
    }

    try {
        const checkInResponse: ApiResponse<CheckinModel> = await restClient.Get(`/checkins/${checkInId}`);
        if (checkInResponse.status !== "success") {
            throw new Error("Failed to fetch check-in details");
        }

        const currentCheckin = checkInResponse.data;
        if (!currentCheckin) {
            throw new Error("Current check-in data is undefined");
        }

        const currentQuantity = currentCheckin.checkInQuantity;
        const transferQty = Number(transferQuantity);

        if (transferQty === currentQuantity) {
            const updateCheckinModel: UpdateCheckinModel = {
                checkOutDate: new Date(),
            };
            await restClient.Put(`/checkins/${checkInId}`, { payload: updateCheckinModel });
        } else {
            const updatedQuantity = currentQuantity - transferQty;
            const updateCheckinModel: UpdateCheckinModel = {
                checkInQuantity: updatedQuantity,
            };
            await restClient.Put(`/checkins/${checkInId}`, { payload: updateCheckinModel });
        }

        const createCheckinModel: CreateCheckinModel = {
            toolId: currentCheckin.toolId,
            projectId: parseInt(projectId, 10),
            checkInDate: new Date(),
            checkInColor: currentCheckin.checkInColor,
            checkInQuantity: transferQty,
            tool: undefined,
            project: undefined
        };
        
        const createNewCheckInResponse: ApiResponse<CheckinModel> = await restClient.Post("/checkins", { payload: createCheckinModel });
        if (createNewCheckInResponse.status !== "success") {
            throw new Error("Failed to create new check-in");
        }

        return redirect("/master-data/checkins");
    } catch (error) {
        console.error("Error during check-in creation or tool update:", error);
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
