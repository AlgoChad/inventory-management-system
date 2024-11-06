import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "@remix-run/react";
import {
    FaChevronLeft,
    FaChevronRight,
    FaHome,
    FaList,
    FaAngleDown,
    FaCogs,
    FaToolbox,
    FaProjectDiagram,
    FaCheckCircle,
    FaUsers,
    FaInfoCircle,
    FaUserCog,
    FaExclamationTriangle,
    FaListAlt
} from "react-icons/fa";
import { Button } from "~/components/ui/button";

type NavItem = {
    path?: string;
    label: string;
    icon: React.ComponentType<{ className: string }>;
    children?: NavItem[];
};

type NavDivider = {
    type: "divider";
};

type NavElement = NavItem | NavDivider;

const navItems: NavElement[] = [
    { path: "/home", label: "Home", icon: FaHome },
    { type: "divider" },
    {
        path: "/reports/project-specific",
        label: "Reports",
        icon: FaList,
        children: [
            {
                path: "/reports/project-specific",
                label: "Project Specific Field Location",
                icon: FaProjectDiagram,
            },
            {
                path: "/reports/queries/tools-movement-history",
                label: "Reports and Queries",
                icon: FaInfoCircle,
                children: [
                    { path: "/reports/queries/tools-movement-history", label: "Movement History", icon: FaListAlt },
                    { path: "/reports/queries/tools-availability", label: "Tools Availability", icon: FaToolbox },
                ],
            },
        ],
    },
    { type: "divider" },
    {
        path: "/master-data/tools",
        label: "Master Data",
        icon: FaCogs,
        children: [
            {
                path: "/master-data/tools",
                label: "Tools",
                icon: FaToolbox,
            },
            {
                path: "/master-data/projects",
                label: "Projects",
                icon: FaProjectDiagram,
            },
            {
                path: "/master-data/checkins",
                label: "Check-ins",
                icon: FaCheckCircle,
            },
            {
                path: "/master-data/personnel",
                label: "Personnel",
                icon: FaUsers,
            },
            {
                path: "/master-data/settings",
                label: "Dropdown Settings",
                icon: FaCogs,
            },
        ],
    },
    { type: "divider" },
    { path: "/auth/account", label: "Account", icon: FaUserCog },
    { type: "divider" },
    { path: "/about", label: "About", icon: FaInfoCircle },
];

function Navbar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [expandedItems, setExpandedItems] = useState<{
        [key: string]: boolean;
    }>({});
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const newExpandedItems: { [key: string]: boolean } = {};
        navItems.forEach((item) => {
            if (isNavItem(item) && item.children) {
                const isActive =
                    location.pathname.startsWith(item.path || "") ||
                    item.children.some((child) =>
                        location.pathname.startsWith(child.path || "")
                    );
                newExpandedItems[item.path || item.label] = isActive;
            }
        });
        setExpandedItems(newExpandedItems);
    }, [location.pathname]);

    const toggleItemExpansion = (path: string) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [path]: !prevState[path],
        }));
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const isNavItem = (item: NavElement): item is NavItem => {
        return (item as NavItem).label !== undefined;
    };

    const renderNavItems = (items: NavElement[]) => {
        return items.map((item, index) => {
            if ("type" in item && item.type === "divider") {
                return (
                    <hr key={index} className="border-t border-gray-700 my-2" />
                );
            }

            if (isNavItem(item)) {
                const NavIcon = item.icon;
                const isItemExpanded = expandedItems[item.path || item.label] || false;

                return (
                    <li key={item.path || item.label} className="flex flex-col group">
                        <Button asChild className="bg-[#fca923] hover:bg-[#e89c1f] text-black">
                            {item.path ? (
                                <Link
                                    to={item.path}
                                    className={`text-black hover:text-gray-600 flex items-start justify-start ${
                                        isExpanded ? "" : "justify-center"
                                    }`}
                                    onClick={() => toggleItemExpansion(item.path || item.label)}
                                >
                                    <NavIcon
                                        className={`text-sm ${
                                            isExpanded ? "mr-2" : ""
                                        }`}
                                    />
                                    {isExpanded && (
                                        <span
                                            className={`${
                                                item.label.length > 15
                                                    ? "text-xs"
                                                    : "text-sm"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                    {item.children && isExpanded && (
                                        <span
                                            className={`ml-auto transition-transform duration-300 ${
                                                isItemExpanded ? "rotate-180" : ""
                                            }`}
                                        >
                                            <FaAngleDown />
                                        </span>
                                    )}
                                </Link>
                            ) : (
                                <div
                                    className={`text-black hover:text-gray-600 flex items-start justify-start ${
                                        isExpanded ? "" : "justify-center"
                                    }`}
                                    onClick={() => toggleItemExpansion(item.label)}
                                >
                                    <NavIcon
                                        className={`text-sm ${
                                            isExpanded ? "mr-2" : ""
                                        }`}
                                    />
                                    {isExpanded && (
                                        <span
                                            className={`${
                                                item.label.length > 15
                                                    ? "text-xs"
                                                    : "text-sm"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                    )}
                                    {item.children && isExpanded && (
                                        <span
                                            className={`ml-auto transition-transform duration-300 ${
                                                isItemExpanded ? "rotate-180" : ""
                                            }`}
                                        >
                                            <FaAngleDown />
                                        </span>
                                    )}
                                </div>
                            )}
                        </Button>
                        {item.children && isExpanded && (
                            <ul
                                className={`ml-4 mt-2 space-y-2 transition-all duration-300 ${
                                    isItemExpanded
                                        ? "max-h-screen"
                                        : "max-h-0 overflow-hidden"
                                } group-hover:max-h-screen`}
                            >
                                {renderNavItems(item.children)}
                            </ul>
                        )}
                    </li>
                );
            }

            return null;
        });
    };

    if (location.pathname === "/auth/login") {
        return null;
    }

    return (
        <nav
            className={`flex flex-col bg-[#2f5f7c] h-screen p-4 transition-width duration-300 shadow-lg ${
                isExpanded ? "w-60" : "w-20"
            }`}
        >
            <Button onClick={toggleSidebar} variant="outline" className="mb-4">
                {isExpanded ? (
                    <FaChevronLeft className="text-sm" />
                ) : (
                    <FaChevronRight className="text-sm" />
                )}
            </Button>
            <ul className="flex flex-col space-y-4">
                {renderNavItems(navItems)}
            </ul>
        </nav>
    );
}

export default Navbar;
