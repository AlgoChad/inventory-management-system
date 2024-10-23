import React, { useState } from "react";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import Pagination from "~/components/app/custom/Pagination";
import { ZodAny } from "zod";
import { Badge } from "~/components/ui/badge";

interface ToolProjectsTableProps {
    toolId: number;
    projects: any[];
}

const ToolProjectsTable: React.FC<ToolProjectsTableProps> = ({ toolId, projects }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(projects.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedProjects = projects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-xs">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Project Name
                            </th>
                            <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Start Date
                            </th>
                            <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                End Date
                            </th>
                            <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Check-In Status
                            </th>
                            <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Color
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProjects.map((project, index) => (
                            <tr key={`${toolId}-${index}`} className="hover:bg-gray-100">
                                <td className="px-2 py-1 border-b border-gray-200">{project.projectName}</td>
                                <td className="px-2 py-1 border-b border-gray-200">{new Date(project.startDate).toDateString()}</td>
                                <td className="px-2 py-1 border-b border-gray-200">{new Date(project.endDate).toDateString()}</td>
                                <td className="px-2 py-1 border-b border-gray-200">{project.checkInQuantity}</td>
                                <td className="px-2 py-1 border-b border-gray-200 text-center">
                                    <Badge variant={project.isCheckedOut ? "destructive" : "secondary"}>{project.isCheckedOut ? "Checked Out": "Checked In"}</Badge>
                                </td>
                                <td className="px-2 py-1 border-b border-gray-200 text-center">
                                    <div style={{ backgroundColor: project.checkInColor, width: '15px', height: '15px', borderRadius: '50%', display: 'inline-block' }}></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ToolProjectsTable;
