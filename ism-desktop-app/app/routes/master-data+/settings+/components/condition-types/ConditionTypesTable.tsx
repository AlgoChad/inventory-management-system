import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { ConditionTypeModel } from "~/data/models/condition-type/ConditionTypeModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/Datatable";
import EditConditionTypeForm from "./EditConditionTypeForm";
import { useSubmit } from "@remix-run/react";

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
                            Name
                            <ArrowDirection direction={column.getIsSorted()} />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const rowValue = row.original;
                return <div className="text-center">{rowValue.name}</div>;
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
                        <Button variant="default" onClick={() => openEditModal(rowValue)}>
                            Edit
                        </Button>
                        <Button variant='destructive' onClick={() => handleDelete(rowValue.id)}>
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
