import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/DatatableServer";
import EditConditionTypeForm from "./EditConditionTypeForm";
import { useSubmit } from "@remix-run/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ConditionTypesTableProps {
    table: Datatable<ConditionTypeModel>;
}

const ConditionTypesTable: React.FC<ConditionTypesTableProps> = ({ table }) => {
    const { data, pagination, defaultSort } = table;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ConditionTypeModel | null>(null);
    const submit = useSubmit();

    const openEditModal = (item: ConditionTypeModel) => {
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
        submit(formData, { method: "post", action: "/master-data/settings/condition-types/delete" });
    };

    const columns: ColumnDef<ConditionTypeModel>[] = [
        {
            accessorKey: "name",
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
                        Name
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">{row.original.name}</div>
            ),
        },
        {
            accessorKey: "createdAt",
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
                        Created At
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {new Date(row.original.createdAt as unknown as string).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "updatedAt",
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
                        Updated At
                        <ArrowDirection direction={column.getIsSorted()} />
                    </Button>
                </div>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {new Date(row.original.updatedAt as unknown as string).toLocaleDateString()}
                </div>
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
                                <Button variant="default" onClick={() => openEditModal(row.original)}>
                                    <FaEdit />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit</p>
                            </TooltipContent>
                        </Tooltip>
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
            {isEditModalOpen && selectedItem && (
                <EditConditionTypeForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    item={selectedItem}
                />
            )}
        </div>
    );
}

export default ConditionTypesTable;
