import { ActionFunction, redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    return redirect("/login");
};