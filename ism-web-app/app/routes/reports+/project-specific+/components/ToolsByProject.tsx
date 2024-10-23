import React from "react";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import Pagination from "~/components/app/custom/Pagination";
import { Badge } from "~/components/ui/badge";

interface ToolsByProjectProps {
    groupedTools: { [key: string]: CheckinModel[] };
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
}

const ToolsByProject: React.FC<ToolsByProjectProps> = ({ groupedTools, currentPage, totalPages, handlePageChange }) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(groupedTools).map(projectId => {
                    const project = groupedTools[projectId][0].project as ProjectModel;
                    return (
                        <div key={projectId} className="bg-white shadow-md rounded-md p-4">
                            <h3 className="text-lg font-semibold mb-1" style={{ borderBottom: `3px solid ${project.color}` }}>
                                {project.projectName}
                            </h3>
                            <p className="text-xs text-gray-600 mb-2">{project.projectDescription}</p>
                            <table className="min-w-full bg-white border border-gray-200 text-xs">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tool Name
                                        </th>
                                        <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Check-In Status
                                        </th>
                                        <th className="px-2 py-1 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Color
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedTools[projectId].map((checkin: CheckinModel) => (
                                        <tr key={checkin.id} className="hover:bg-gray-100">
                                            <td className="px-2 py-1 border-b border-gray-200">{checkin.tool.toolName}</td>
                                            <td className="px-2 py-1 border-b border-gray-200">{checkin.checkInQuantity}</td>
                                            <td className="px-2 py-1 border-b border-gray-200 text-center">
                                                <Badge variant={checkin.checkOutDate ? "destructive" : "secondary"}>{checkin.checkOutDate ? "Checked Out": "Checked In"}</Badge>
                                            </td>
                                            <td className="px-2 py-1 border-b border-gray-200 text-center">
                                                <div style={{ backgroundColor: checkin.checkInColor, width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
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

export default ToolsByProject;
