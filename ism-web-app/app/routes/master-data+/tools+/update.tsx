import { ActionFunction, json, redirect } from "@remix-run/node";
import IToolService from "~/core/services/tools/IToolService";
import ToolService from "~/core/services/tools/ToolService";

export const action: ActionFunction = async ({ request }) => {
    const toolService: IToolService = new ToolService();

    const formData = await request.formData();
    const id = formData.get("id");
    const toolName = formData.get("toolName");
    const quantity = formData.get("quantity");
    const conditionId = formData.get("conditionId");
    const statusId = formData.get("statusId");
    const personnelId = formData.get("personnelId");

    if (
        typeof id !== "string" || id.trim() === "" ||
        typeof toolName !== "string" || toolName.trim() === "" ||
        typeof quantity !== "string" || quantity.trim() === ""
    ) {
        return json(
            { success: false, error: "Invalid data provided" },
            { status: 400 }
        );
    }

    try {
        const result = await toolService.UpdateToolAsync(Number(id), {
            toolName,
            quantity: Number(quantity),
            conditionId: conditionId ? Number(conditionId) : undefined,
            statusId: statusId ? Number(statusId) : undefined,
            personnelId: personnelId ? Number(personnelId) : undefined,
        });

        if (!result) {
            return json(
                { success: false, error: "Failed to update tool" },
                { status: 500 }
            );
        }
        
        return redirect("/master-data/tools");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
