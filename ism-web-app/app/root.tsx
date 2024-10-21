import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import { AppLoadContext, LoaderFunction, json } from "@remix-run/node";
import "./tailwind.css";
import Navbar from "./components/app/custom/NavBar";
import Header from "./components/app/custom/Header";
import { getSession } from "~/sessions";
import { requireUserSession } from "./session-check";

export const loader: LoaderFunction = async ({ request }) => {
    await requireUserSession({
        request,
        params: {},
        context: {} as AppLoadContext
    });
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");

    return json({ userId });
};

function Document({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="bg-gray-100 text-gray-900">
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    const loaderData = useLoaderData();

    return (
        <Document>
            <div className="flex h-screen overflow-hidden">
                <Navbar />
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-y-auto container w-100% mx-auto p-4 mt-5">
                        {children}
                    </main>
                </div>
            </div>
        </Document>
    );
}

export default function App() {
    return (
        <Outlet />
    );
}