import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { ToolRequest } from "~/data/models/tool/ToolModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/DatatableServer";
import { useSubmit } from "@remix-run/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

interface ToolRequestsTableProps {
    table: Datatable<ToolRequest>;
}

const ToolRequestsTable: React.FC<ToolRequestsTableProps> = ({ table }) => {
    const { data, pagination, defaultSort } = table;
    const submit = useSubmit();

    const handleApprove = (id: number) => {
        const formData = new FormData();
        formData.append("requestId", id.toString());
        formData.append("actionType", "approve");
        submit(formData, { method: "post", action: "/master-data/tool-request/request-action" });
    };

    const handleReject = (id: number) => {
        const formData = new FormData();
        formData.append("requestId", id.toString());
        formData.append("actionType", "reject");
        submit(formData, { method: "post", action: "/master-data/tool-request/request-action" });
    };

    const handleDelete = (id: number) => {
        const formData = new FormData();
        formData.append("requestId", id.toString());
        formData.append("actionType", "delete");
        submit(formData, { method: "post", action: "/master-data/tool-request/request-action" });
    };

    const columns: ColumnDef<ToolRequest>[] = [
        {
            accessorKey: "tool.toolName",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Tool Name
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">{row.original.tool.toolName}</div>
            ),
        },
        {
            accessorKey: "personnel.name",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Requested By
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">{row.original.personnel.name}</div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Status
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">{row.original.status}</div>
            ),
        },
        {
            accessorKey: "actions",
            header: () => (
                <div className="text-center">
                    Actions
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center space-x-2">
                    <TooltipProvider>
                        {row.original.status !== "Approved" && row.original.status !== "Rejected" && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="default" onClick={() => handleApprove(row.original.id)}>
                                        <FaCheck />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Approve</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {row.original.status !== "Rejected" && row.original.status === "Approved" && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" onClick={() => handleReject(row.original.id)}>
                                        <FaTimes />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reject</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="destructive" onClick={() => handleDelete(row.original.id)}>
                                    <FaTrash />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Delete</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    return (
        <div>
            <DataTable
                columns={columns}
                tableData={data}
                pagination={pagination}
                defaultSort={defaultSort}
            />
        </div>
    );
}

export default ToolRequestsTable;
