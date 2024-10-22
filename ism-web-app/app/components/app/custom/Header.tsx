import { useLocation } from "react-router-dom";
import { Form } from "@remix-run/react";
import { FaSignOutAlt } from "react-icons/fa";
import liveWiseLogo from "~/assets/livewise.jpg";

export default function Header() {
    const location = useLocation();

    const shouldShowLogout = !location.pathname.includes("login");

    return (
        <header className="bg-[#2f5f7c] shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <img src={liveWiseLogo} alt="Live Wise Construction" className="h-12 rounded-md shadow-lg" />
                <h1 className="text-2xl font-bold text-white">Livewise Construction</h1>
            </div>
            {shouldShowLogout && (
                <Form method="post" action="/auth/logout">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md shadow-md transition duration-300"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </Form>
            )}
        </header>
    );
}
