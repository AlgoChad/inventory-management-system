import { useState, useEffect } from "react";
import { Form, useActionData, redirect } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import { ChangePasswordModel, ChangePasswordResult } from "@/app/data/models/authentication/AuthenticationModel";
import RestClient from "@/app/data/rest/RestClient";
import { getSession, commitSession } from "app/sessions";
import { ApiResponse } from "~/data/models/generic/ApiModel";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

const API_BASE_URL = process.env.API_BASE_URL as string;
const API_TOKEN = process.env.API as string;
const restClient = new RestClient(API_BASE_URL, API_TOKEN);

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!oldPassword || !newPassword) {
        return json({ error: "All fields are required" }, { status: 400 });
    }

    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");

    if (!userId) {
        return json({ error: "User not authenticated" }, { status: 401 });
    }

    const changePasswordModel: ChangePasswordModel = { userId: Number(userId), oldPassword, newPassword };

    try {
        const response: ApiResponse<ChangePasswordResult> = await restClient.Post("/auth/change-password", { payload: changePasswordModel });
        if (response.status === "success") {
            return json({ success: response.data?.isSuccess, message: response.data?.message });
        } else {
            return json({ success: response.data?.isSuccess, error: response?.data?.message || "Password change failed" });
        }
    } catch (error) {
        return json({ error: (error as Error).message }, { status: 500 });
    }
};

export default function AccountPage() {
    const actionData = useActionData<{ error?: string; success?: string, message?: string }>();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (actionData?.success) {
            toast(actionData?.message, {
                description: "Your password has been changed successfully.",
            });
            setOldPassword("");
            setNewPassword("");
        }
        if (actionData?.error) {
            toast(actionData.error, {
                description: "An error occurred while changing your password.",
            });
        }
    }, [actionData]);

    return (
        <div className="max-w-md mx-auto mt-5 p-6 bg-white rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
            <h1 className="text-2xl font-semibold text-center text-gray-800">Change Password</h1>
            <Form method="post" className="space-y-4 mt-4">
                <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                        Old Password:
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="oldPassword"
                        name="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-white text-gray-900 transition duration-300 ease-in-out transform focus:scale-105"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password:
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="bg-[#fca923] text-black hover:bg-[#e89c1f] px-4 py-2 rounded-md shadow-md transition duration-300"
                    >
                        Change Password
                    </Button>
                </div>
            </Form>
        </div>
    );
}
