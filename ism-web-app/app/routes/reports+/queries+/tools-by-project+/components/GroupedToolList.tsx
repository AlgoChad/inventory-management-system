import React, { useState } from "react";
import { ToolModel } from "~/data/models/tool/ToolModel";
import ToolTable from "./ToolTable";
import Pagination from "~/components/app/custom/Pagination";
import { Button } from "~/components/ui/button";

interface GroupedToolListProps {
    groupedTools: {
        [projectId: number]: {
            projectDescription: string;
            tools: ToolModel[];
        };
    };
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
}

const GroupedToolList: React.FC<GroupedToolListProps> = ({ groupedTools, currentPage, totalPages, handlePageChange }) => {
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPageState, setCurrentPageState] = useState<{ [projectId: number]: number }>({});

    const pageSize = 5;

    const sortedGroups = Object.entries(groupedTools).sort(([projectIdA], [projectIdB]) => {
        if (sortOrder === "asc") {
            return projectIdA.localeCompare(projectIdB);
        } else {
            return projectIdB.localeCompare(projectIdA);
        }
    });

    const handleSortChange = (order: "asc" | "desc") => {
        setSortOrder(order);
    };

    const handlePageChangeLocal = (projectId: number, page: number) => {
        setCurrentPageState((prev) => ({ ...prev, [projectId]: page }));
    };

    return (
        <div>
            <div className="h-[calc(100vh-200px)] overflow-y-auto bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-end mb-2">
                    <Button
                        className={`px-2 py-1 text-xs rounded ${sortOrder === "asc" ? "" : "bg-gray-200 text-black"}`}
                        onClick={() => handleSortChange("asc")}
                    >
                        Sort Ascending
                    </Button>
                    <Button
                        className={`ml-2 px-2 py-1 text-xs rounded ${sortOrder === "desc" ? "" : "bg-gray-200 text-black"}`}
                        onClick={() => handleSortChange("desc")}
                    >
                        Sort Descending
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedGroups.map(([projectId, { projectDescription, tools }]) => {
                        const currentProjectPage = currentPageState[Number(projectId)] || 1;
                        const totalPagesLocal = Math.ceil(tools.length / pageSize);
                        const paginatedTools = tools.slice((currentProjectPage - 1) * pageSize, currentProjectPage * pageSize);

                        return (
                            <div key={projectId} className="bg-white p-4 rounded-lg shadow-lg">
                                <h1 className="text-xl font-bold mb-2 text-black">Project Name: {projectDescription}</h1>
                                <ToolTable tools={paginatedTools} />
                                <Pagination
                                    currentPage={currentProjectPage}
                                    totalPages={totalPagesLocal}
                                    onPageChange={(page) => handlePageChangeLocal(Number(projectId), page)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default GroupedToolList;
