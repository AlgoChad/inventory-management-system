import { ActionFunction, json, redirect } from "@remix-run/node";
import IToolService from "~/core/services/tools/IToolService";
import ToolService from "~/core/services/tools/ToolService";

export const action: ActionFunction = async ({ request }) => {
    const toolService: IToolService = new ToolService();
    const formData = await request.formData();
    const id = formData.get("id");

    if (typeof id !== "string" || id.trim() === "") {
        return json(
            { success: false, error: "Invalid ID provided" },
            { status: 400 }
        );
    }

    try {
        await toolService.DeleteToolAsync(Number(id));

        return redirect("/master-data/tools");
    } catch (error) {
        return json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
};
