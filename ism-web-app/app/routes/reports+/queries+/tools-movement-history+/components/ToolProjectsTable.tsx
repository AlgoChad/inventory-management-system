import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DatatableClient from "~/components/app/custom/DatatableClient";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";

interface ToolProjectsTableProps {
    toolId: number;
    projects: any[];
}

const ToolProjectsTable: React.FC<ToolProjectsTableProps> = ({ toolId, projects }) => {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "projectName",
            header: ({ column }) => (
                <div className="text-center text-xs">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Project Name
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.projectName}</div>
            ),
        },
        {
            accessorKey: "dateRange",
            header: ({ column }) => (
                <div className="text-center text-xs">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Date Range
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">
                    {new Date(row.original.startDate).toLocaleDateString()} - {new Date(row.original.endDate).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "checkInQuantity",
            header: ({ column }) => (
                <div className="text-center text-xs">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Quantity
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.checkInQuantity}</div>
            ),
        },
        {
            accessorKey: "isCheckedOut",
            header: ({ column }) => (
                <div className="text-center text-xs">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Check-In Status
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">
                    <Badge variant={row.original.isCheckedOut ? "destructive" : "secondary"}>
                        {row.original.isCheckedOut ? "Checked Out" : "Checked In"}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "checkInColor",
            header: ({ column }) => (
                <div className="text-center text-xs">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Check-In Color
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">
                    <div style={{ backgroundColor: row.original.checkInColor, width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></div>
                </div>
            ),
        },
        {
            accessorKey: "projectColor",
            header: ({ column }) => (
                <div className="text-center text-xs">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            column.toggleSorting(
                                column.getIsSorted() === "asc"
                            )
                        }
                    >
                        Project Color
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">
                    <div style={{ backgroundColor: row.original.projectColor, width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></div>
                </div>
            ),
        },
    ];

    return (
        <div className="overflow-x-auto">
            <DatatableClient data={projects} columns={columns} pageSize={5} />
        </div>
    );
};

export default ToolProjectsTable;
