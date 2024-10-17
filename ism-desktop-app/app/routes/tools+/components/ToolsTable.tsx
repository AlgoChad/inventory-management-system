import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/Datatable";
import EditToolForm from "./EditToolForm";
import { useSubmit } from "@remix-run/react";

interface ToolTableProps {
    table: Datatable<ToolModel>;
    conditionTypes: Array<{ id: number; name: string }>;
    statusTypes: Array<{ id: number; name: string }>;
    projects: Array<{ id: number; name: string }>;
    personnel: Array<{ id: number; name: string }>;
}

const ToolTable: React.FC<ToolTableProps> = ({
    table,
    conditionTypes,
    statusTypes,
    projects,
    personnel,
}) => {
    const { data, pagination, defaultSort } = table;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ToolModel | null>(null);
    const submit = useSubmit();

    const openEditModal = (item: ToolModel) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedItem(null);
        setIsEditModalOpen(false);
    };

    const handleDelete = (id: number) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        submit(formData, { method: "post", action: "/tools/delete" });
    };

    const columns: ColumnDef<ToolModel>[] = [
        {
            accessorKey: "toolNumber",
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
                            Tool Number
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return <div className="text-center">{rowValue.toolNumber}</div>;
            },
        },
        {
            accessorKey: "toolDescription",
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
                            Description
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">
                        {rowValue.toolDescription}
                    </div>
                );
            },
        },
        {
            accessorKey: "quantity",
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
                            Quantity
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return <div className="text-center">{rowValue.quantity}</div>;
            },
        },
        {
            accessorKey: "status.name",
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
                            Status Type
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">{rowValue.status.name}</div>
                );
            },
        },
        {
            accessorKey: "condition.name",
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
                            Condition Type
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center">{rowValue.condition.name}</div>
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
                        {new Date(
                            rowValue.createdAt as unknown as string
                        ).toLocaleDateString()}
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
                        {new Date(
                            rowValue.updatedAt as unknown as string
                        ).toLocaleDateString()}
                    </div>
                );
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const rowValue = row.original;
                return (
                    <div className="text-center space-x-2">
                        <Button
                            variant="default"
                            onClick={() => openEditModal(rowValue)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDelete(rowValue.id)}
                        >
                            Delete
                        </Button>
                    </div>
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
                <EditToolForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    item={selectedItem}
                    conditionTypes={conditionTypes}
                    statusTypes={statusTypes}
                    projects={projects}
                    personnel={personnel}
                />
            )}
        </div>
    );
};

export default ToolTable;
