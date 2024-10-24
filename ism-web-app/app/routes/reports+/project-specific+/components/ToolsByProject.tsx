import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { Badge } from "~/components/ui/badge";
import DatatableClient from "~/components/app/custom/DatatableClient";
import Pagination from "~/components/app/custom/Pagination";

interface ToolsByProjectProps {
    groupedTools: { [key: string]: CheckinModel[] };
}

const ToolsByProject: React.FC<ToolsByProjectProps> = ({ groupedTools }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const totalPages = Math.ceil(Object.keys(groupedTools).length / pageSize);

    const columns: ColumnDef<CheckinModel>[] = [
        {
            accessorKey: "tool.toolName",
            header: () => <div className="text-center">Tool Name</div>,
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.tool.toolName}</div>
            ),
        },
        {
            accessorKey: "checkInQuantity",
            header: () => <div className="text-center">Quantity</div>,
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.checkInQuantity}</div>
            ),
        },
        {
            accessorKey: "checkOutDate",
            header: () => <div className="text-center">Check-In Status</div>,
            cell: ({ getValue }) => (
                <div className="text-center text-xs">
                    <Badge variant={getValue() ? "destructive" : "secondary"}>
                        {getValue() ? "Checked Out" : "Checked In"}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "checkInColor",
            header: () => <div className="text-center">Check-In Color</div>,
            cell: ({ getValue }) => (
                <div className="text-center text-xs">
                    <div
                        style={{
                            backgroundColor: getValue() as string,
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            display: "inline-block",
                        }}
                    ></div>
                </div>
            ),
        },
    ];

    const paginatedProjects = Object.keys(groupedTools).slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {paginatedProjects.map((projectId) => {
                    const project = groupedTools[projectId][0]
                        .project as ProjectModel;
                    const data = groupedTools[projectId];

                    return (
                        <div
                            key={projectId}
                            className="bg-white shadow-lg rounded-sm p-2"
                        >
                            <h3
                                className="text-base font-semibold mb-1 text-center"
                                style={{
                                    borderBottom: `2px solid ${project.color}`,
                                }}
                            >
                                {project.projectName}
                            </h3>
                            <p className="text-xs text-gray-600 mb-1 text-center">
                                {project.projectDescription}
                            </p>
                            <DatatableClient data={data} columns={columns} pageSize={3} />
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-center mt-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ToolsByProject;
