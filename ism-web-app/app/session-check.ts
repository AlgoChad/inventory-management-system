import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";

export const requireUserSession: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    if (url.pathname === "/login") {
        return null;
    }

    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");

    if (!userId) {
        throw redirect("/login");
    }

    return null;
};