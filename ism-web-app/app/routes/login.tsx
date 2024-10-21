import { useState } from "react";
import { Form, useActionData, redirect } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import { LoginModel, LoginResult } from "@/app/data/models/authentication/AuthenticationModel";
import RestClient from "@/app/data/rest/RestClient";
import { getSession, commitSession } from "app/sessions";
import { ApiResponse } from "~/data/models/generic/ApiModel";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API_TOKEN as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return json({ error: "Email and password are required" }, { status: 400 });
    }

    const loginModel: LoginModel = { email, password };

    try {
        const response: ApiResponse<LoginResult> = await restClient.Post("/auth/login", { payload: loginModel });
        if (response.status === "success") {
            const session = await getSession(request.headers.get("Cookie"));
            session.set("userId", response.data?.userId);

            console.log(response);

            return redirect("/home", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        } else {
            return json({ error: response?.data?.message || "Login failed" }, { status: 400 });
        }
    } catch (error) {
        return json({ error: (error as Error).message }, { status: 500 });
    }
};

export default function LoginPage() {
    const actionData = useActionData<{ error?: string }>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-center text-gray-800">Login</h1>
            <Form method="post" className="space-y-4 mt-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900"
                    />
                </div>
                {actionData?.error && (
                    <div className="text-red-500 text-sm">{actionData.error}</div>
                )}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-black shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        Login
                    </button>
                </div>
            </Form>
        </div>
    );
}