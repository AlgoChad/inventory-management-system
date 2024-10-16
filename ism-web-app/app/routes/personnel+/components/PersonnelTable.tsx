import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { PersonnelModel } from "~/data/models/personnel/PersonnelModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/Datatable";
import EditPersonnelForm from "./EditPersonnelForm";
import { useFetcher } from "@remix-run/react";

interface PersonnelTableProps {
    table: Datatable<PersonnelModel>;
}

const PersonnelTable: React.FC<PersonnelTableProps> = ({ table }) => {
    const { data, pagination, defaultSort } = table;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PersonnelModel | null>(null);
    const fetcher = useFetcher();

    const openEditModal = (item: PersonnelModel) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedItem(null);
        setIsEditModalOpen(false);
    };

    const handleDelete = (id: number) => {
        fetcher.submit({ id }, { method: "post", action: "/personnel/delete" });
    };

    const columns: ColumnDef<PersonnelModel>[] = [
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
                <EditPersonnelForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    item={selectedItem}
                />
            )}
        </div>
    );
}

export default PersonnelTable;
