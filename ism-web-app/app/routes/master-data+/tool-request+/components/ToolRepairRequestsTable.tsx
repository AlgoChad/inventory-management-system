import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { ToolRepairRequest } from "~/data/models/tool/ToolModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/DatatableServer";
import { useSubmit } from "@remix-run/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { FaCheck, FaTimes, FaTrash, FaWrench, FaEye } from "react-icons/fa";
import ToolRepairRequestDetailModal from "./ToolRepairRequestDetailModal";


interface ToolRepairRequestsTableProps {
    table: Datatable<ToolRepairRequest>;
}

const ToolRepairRequestsTable: React.FC<ToolRepairRequestsTableProps> = ({ table }) => {
    const { data, pagination, defaultSort } = table;
    const submit = useSubmit();
    const [selectedRequest, setSelectedRequest] = useState<ToolRepairRequest | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleApprove = (id: number) => {
        const formData = new FormData();
        formData.append("requestId", id.toString());
        formData.append("actionType", "approve");
        submit(formData, { method: "post", action: "/master-data/tool-request/repair-action" });
    };

    const handleComplete = (id: number) => {
        const formData = new FormData();
        formData.append("requestId", id.toString());
        formData.append("actionType", "complete");
        submit(formData, { method: "post", action: "/master-data/tool-request/repair-action" });
    };

    const handleReject = (id: number) => {
        const formData = new FormData();
        formData.append("requestId", id.toString());
        formData.append("actionType", "reject");
        submit(formData, { method: "post", action: "/master-data/tool-request/repair-action" });
    };

    const handleDelete = (id: number) => {
        const formData = new FormData();
        formData.append("requestId", id.toString());
        formData.append("actionType", "delete");
        submit(formData, { method: "post", action: "/master-data/tool-request/repair-action" });
    };

    const handleViewDetails = (request: ToolRepairRequest) => {
        setSelectedRequest(request);
        setIsDetailModalOpen(true);
    };

    const columns: ColumnDef<ToolRepairRequest>[] = [
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
            accessorKey: "description",
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
                        Description
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">{row.original.description}</div>
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
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="default" onClick={() => handleViewDetails(row.original)}>
                                    <FaEye />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View Details</p>
                            </TooltipContent>
                        </Tooltip>
                        {row.original.status === "Pending" && (
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
                        {row.original.status === "In Repair" && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="default" onClick={() => handleComplete(row.original.id)}>
                                        <FaWrench />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Complete</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                        {row.original.status === "Pending" && (
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
            <ToolRepairRequestDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                request={selectedRequest}
            />
        </div>
    );
}

export default ToolRepairRequestsTable;
