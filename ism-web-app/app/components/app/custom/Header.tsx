import { useLocation } from "react-router-dom";
import { Form } from "@remix-run/react";
import { FaSignOutAlt } from "react-icons/fa";
import liveWiseLogo from "~/assets/livewise.jpg";

export default function Header() {
    const location = useLocation();

    const shouldShowLogout = !location.pathname.includes("login");

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <img src={liveWiseLogo} alt="Live Wise Construction" className="h-11" />
                <h1 className="text-xl font-semibold text-gray-800">Live Wise Construction</h1>
            </div>
            {shouldShowLogout && (
                <Form method="post" action="/logout">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 text-gray-800 hover:text-gray-600"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </Form>
            )}
        </header>
    );
}