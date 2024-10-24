import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/DatatableServer";
import EditCheckinForm from "./EditCheckinForm";
import TransferCheckinForm from "./TransferCheckinForm";
import { useSubmit } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { FaCheck, FaEdit, FaExchangeAlt, FaTrash } from "react-icons/fa";

interface CheckinTableProps {
    table: Datatable<CheckinModel>;
    projects: ProjectModel[];
    tools: ToolModel[];
}

const CheckinTable: React.FC<CheckinTableProps> = ({ table, projects, tools }) => {
    const { data, pagination, defaultSort } = table;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CheckinModel | null>(null);
    const submit = useSubmit();

    const openEditModal = (item: CheckinModel) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedItem(null);
        setIsEditModalOpen(false);
    };

    const openTransferModal = (item: CheckinModel) => {
        setSelectedItem(item);
        setIsTransferModalOpen(true);
    };

    const closeTransferModal = () => {
        setSelectedItem(null);
        setIsTransferModalOpen(false);
    };

    const handleDelete = (id: number) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        submit(formData, { method: "post", action: "/master-data/checkins/delete" });
    };

    const handleCheckout = (id: number) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        submit(formData, { method: "post", action: "/master-data/checkins/checkout" });
    }

    const columns: ColumnDef<CheckinModel>[] = [
        {
            accessorKey: "tool.toolDescription",
            header: ({ column }) => {
                return (
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
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return <div className="text-center">{rowValue.tool.toolName}</div>;
            },
        },
        {
            accessorKey: "project.projectDescription",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
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
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return <div className="text-center">{rowValue.project.projectName}</div>;
            },
        },
        {
            accessorKey: "checkInDate",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Check-In Date
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        <Badge variant="default">
                            {new Date(rowValue.checkInDate as unknown as string).toLocaleDateString()}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "checkOutDate",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Check-Out Date
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        {rowValue.checkOutDate ? (
                            <Badge variant="secondary">
                                {new Date(rowValue.checkOutDate as unknown as string).toLocaleDateString()}
                            </Badge>
                        ) : (
                            <Badge variant="outline">N/A</Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Created At
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        <Badge variant="default">
                            {new Date(rowValue.createdAt as unknown as string).toLocaleDateString()}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Updated At
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        <Badge variant="default">
                            {new Date(rowValue.updatedAt as unknown as string).toLocaleDateString()}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "isCheckOut",
            header: ({ column }) => {
                return (
                    <div className="text-center">
                        <span>Status</span>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        <Badge variant={rowValue.checkOutDate ? "destructive" : "secondary"}>
                            {rowValue.checkOutDate ? "Is Checked Out" : "Is Checked In"}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "actions",
            header: ({column}) => {
                return (
                    <div className="text-center">
                        <span>Actions</span>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <TooltipProvider>
                        <div className="text-center space-x-2">
                            {!rowValue.checkOutDate && (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="outline" onClick={() => handleCheckout(rowValue.id)}>
                                                <FaCheck />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Checkout</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="secondary" onClick={() => openTransferModal(rowValue)}>
                                                <FaExchangeAlt />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Transfer</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="default" onClick={() => openEditModal(rowValue)}>
                                        <FaEdit />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="destructive" onClick={() => handleDelete(rowValue.id)}>
                                        <FaTrash />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </TooltipProvider>
                );
            },
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
            {isEditModalOpen && selectedItem && (
                <EditCheckinForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    item={selectedItem}
                    projects={projects}
                    tools={tools}
                />
            )}
            {isTransferModalOpen && selectedItem && (
                <TransferCheckinForm
                    isOpen={isTransferModalOpen}
                    onClose={closeTransferModal}
                    item={selectedItem}
                    projects={projects} tools={tools}                
                    
                    />
            )}
        </div>
    );
}

export default CheckinTable;
