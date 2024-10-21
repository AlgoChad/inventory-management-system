import type { LinksFunction, MetaFunction, LoaderFunction, AppLoadContext } from "@remix-run/node";
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "@remix-run/react";
import "./globals.css";
import styles from "./globals.css";
import React from "react";
import Navbar from "./components/app/custom/NavBar";
import Header from "./components/app/custom/Header";
import { FaWindowClose, FaWindowMaximize, FaWindowMinimize } from "react-icons/fa";

export const meta: MetaFunction = () => [{ title: "New Remix App" }];

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];


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
                <LiveReload />
            </body>
        </html>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {

    return (
        <Document>
            <div className="flex flex-col h-screen overflow-hidden">
                <div className="titlebar flex items-center justify-between px-4 py-2 bg-black text-white absolute top-0 left-0 right-0 z-10">
                    <div className="title">Inventory Management System</div>
                    <div className="window-controls flex space-x-2">
                        <button className="minimize" onClick={() => (window as any).api.minimizeWindow()}>
                            <FaWindowMinimize />
                        </button>
                        <button className="maximize" onClick={() => (window as any).api.maximizeWindow()}>
                            <FaWindowMaximize />
                        </button>
                        <button className="close" onClick={() => (window as any).api.closeWindow()}>
                            <FaWindowClose />
                        </button>
                    </div>
                </div>
                <div className="flex flex-1 pt-7"> {/* Add padding to avoid overlap with title bar */}
                    <Navbar />
                    <div className="flex-1 flex flex-col">
                        <Header/>
                        <main className="flex-1 overflow-y-auto container mx-auto p-4 mt-5">
                            {children}
                        </main>
                    </div>
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