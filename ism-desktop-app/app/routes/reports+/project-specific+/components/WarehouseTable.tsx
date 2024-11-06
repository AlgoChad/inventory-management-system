import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ToolModel } from "~/data/models/tool/ToolModel";
import DatatableClient from "~/components/app/custom/DatatableClient";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";

interface WarehouseTableProps {
    tools: ToolModel[];
    totalQuantity: number;
}

const WarehouseTable: React.FC<WarehouseTableProps> = ({ tools, totalQuantity }) => {
    const columns: ColumnDef<ToolModel>[] = [
        {
            accessorKey: "toolNumber",
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
                        Tool Number
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.toolNumber}</div>
            ),
        },
        {
            accessorKey: "toolName",
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
                        Tool Name
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.toolName}</div>
            ),
        },
        {
            accessorKey: "quantity",
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
                        Available Quantity
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.quantity}</div>
            ),
        },
        {
            accessorKey: "condition.name",
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
                        Condition
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.condition.name}</div>
            ),
        },
        {
            accessorKey: "status.name",
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
                        Status
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.status.name}</div>
            ),
        },
        {
            accessorKey: "personnel.name",
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
                        Personnel
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center text-xs">{row.original.personnel.name}</div>
            ),
        },
    ];

    const footer = (
        <div className="min-w-full bg-white border border-gray-200 text-xs px-2 py-1 border-t border-gray-200 font-semibold">
            Total Tools Quantity: {totalQuantity}
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <DatatableClient data={tools} columns={columns} pageSize={5} footer={footer} />
        </div>
    );
};

export default WarehouseTable;
