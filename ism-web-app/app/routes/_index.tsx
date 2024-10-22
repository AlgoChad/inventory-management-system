import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");

    if (!userId) {
        return redirect("/auth/login");
    }

    return redirect("/home");
};
