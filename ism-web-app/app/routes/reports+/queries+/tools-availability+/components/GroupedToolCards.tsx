import React, { useState } from "react";
import { ToolModel } from "~/data/models/tool/ToolModel";
import Pagination from "~/components/app/custom/Pagination";

interface GroupedToolCardsProps {
    groupedTools: { [key: string]: ToolModel[] };
    title: string;
}

const GroupedToolCards: React.FC<GroupedToolCardsProps> = ({
    groupedTools,
    title,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedGroups = Object.entries(groupedTools).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(Object.keys(groupedTools).length / itemsPerPage);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>
            <div className="grid grid-cols-1 gap-4">
                {paginatedGroups.map(([groupKey, tools]) => (
                    <div key={groupKey} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h3 className="text-md font-semibold mb-2 text-gray-700">{groupKey}</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            {tools.map((tool) => (
                                <li key={tool.id}>
                                    {tool.toolNumber} - {tool.toolName}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default GroupedToolCards;
