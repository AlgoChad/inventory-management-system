import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/") {
        return redirect("auth/login");
    }

    return redirect("/home");
};
