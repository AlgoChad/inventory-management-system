import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "react-icons/fa";
import { Button } from "~/components/ui/button";


type NavItem = {
    path: string;
    label: string;
    icon: React.ComponentType<{ className: string }>;
    children?: NavItem[];
};

type NavDivider = {
    type: "divider";
};

type NavElement = NavItem | NavDivider;

const navItems: NavElement[] = [
    { path: "/", label: "Home", icon: FaHome },
    { type: "divider" },
    {
        path: "/settings",
        label: "Settings",
        icon: FaCogs,
    },
    {
        path: "/tools",
        label: "Tools",
        icon: FaToolbox,
    },
    {
        path: "/projects",
        label: "Projects",
        icon: FaProjectDiagram,
    },
    {
        path: "/checkins",
        label: "Check-ins",
        icon: FaCheckCircle,
    },
    {
        path: "/personnel",
        label: "Personnel",
        icon: FaUsers,
    },
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
                    location.pathname.startsWith(item.path) ||
                    item.children.some((child) =>
                        location.pathname.startsWith(child.path)
                    );
                newExpandedItems[item.path] = isActive;
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
        return (item as NavItem).path !== undefined;
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
                const isItemExpanded = expandedItems[item.path] || false;

                return (
                    <li key={item.path} className="flex flex-col group">
                        <Button asChild>
                            <Link
                                to={item.path}
                                className={`text-white hover:text-gray-400 flex items-start justify-start ${
                                    isExpanded ? "" : "justify-center"
                                }`}
                                onClick={() => toggleItemExpansion(item.path)}
                            >
                                <NavIcon
                                    className={`text-sm ${
                                        isExpanded ? "mr-2" : ""
                                    }`}
                                />
                                {isExpanded && <span>{item.label}</span>}
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

    return (
        <nav
            className={`flex flex-col bg-black h-screen p-4 transition-width duration-300 ${
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
