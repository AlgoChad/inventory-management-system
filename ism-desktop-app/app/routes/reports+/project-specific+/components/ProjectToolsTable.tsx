import React, { useState } from "react";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface ProjectToolsTableProps {
    tools: ToolModel[];
}

const ProjectToolsTable: React.FC<ProjectToolsTableProps> = ({ tools }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(tools.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedTools = tools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="overflow-x-auto">
            {tools.length > 0 ? (
                <>
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md text-xs">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="py-1 px-2 border-b text-left font-semibold">Tool Number</th>
                                <th className="py-1 px-2 border-b text-left font-semibold">Description</th>
                                <th className="py-1 px-2 border-b text-left font-semibold">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTools.map((tool) => (
                                <tr key={tool.id} className="hover:bg-gray-100 transition-colors duration-200">
                                    <td className="py-1 px-2 border-b text-black">{tool.toolNumber}</td>
                                    <td className="py-1 px-2 border-b text-black">{tool.toolDescription}</td>
                                    <td className="py-1 px-2 border-b text-black">{tool.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-2">
                        <button
                            className="px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="text-black text-xs">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-black text-xs">No tools available for this project.</p>
            )}
        </div>
    );
};

export default ProjectToolsTable;
