import { useState } from "react";
import { Form, useActionData, redirect } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import { LoginModel, LoginResult } from "@/app/data/models/authentication/AuthenticationModel";
import RestClient from "@/app/data/rest/RestClient";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { Button } from "~/components/ui/button";
import liveWiseLogo from "~/assets/livewise.jpg";

export const action: ActionFunction = async ({ request }) => {
    const API_BASE_URL = process.env.API_BASE_URL as string;
    const API_TOKEN = process.env.API_TOKEN as string;
    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

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
          
            return redirect("/home");
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
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="max-w-md mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
            <h1 className="text-2xl font-semibold text-center text-gray-800">Login</h1>
            <center>
                <img src={liveWiseLogo} alt="Live Wise Construction" className="h-50 rounded-md shadow-lg" />
            </center>
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
                        className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900 transition duration-300 ease-in-out transform focus:scale-105"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password:
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900 transition duration-300 ease-in-out transform focus:scale-105"
                    />
                    <div className="mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="form-checkbox"
                            />
                            <span className="ml-2 text-sm text-gray-700">Show Password</span>
                        </label>
                    </div>
                </div>
                {actionData?.error && (
                    <div className="text-red-500 text-sm">{actionData.error}</div>
                )}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="bg-[#fca923] text-black hover:bg-[#e89c1f] px-4 py-2 rounded-md shadow-md transition duration-300"
                    >
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    );
}
