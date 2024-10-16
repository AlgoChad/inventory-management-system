import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/Datatable";
import EditProjectForm from "./EditProjectForm";
import { useFetcher } from "@remix-run/react";

interface ProjectsTableProps {
    table: Datatable<ProjectModel>;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ table }) => {
    const { data, pagination, defaultSort } = table;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProjectModel | null>(null);
    const fetcher = useFetcher();

    const openEditModal = (item: ProjectModel) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedItem(null);
        setIsEditModalOpen(false);
    };

    const handleDelete = (id: number) => {
        fetcher.submit({ id }, { method: "post", action: "/projects/delete" });
    };

    const columns: ColumnDef<ProjectModel>[] = [
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
                return <div className="text-center">{rowValue.projectDescription}</div>;
            },
        },
        {
            accessorKey: "startDate",
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
                            Start Date
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
                            rowValue.startDate as unknown as string
                        ).toLocaleDateString()}
                    </div>
                );
            },
        },
        {
            accessorKey: "endDate",
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
                            Start Date
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
                            rowValue.endDate as unknown as string
                        ).toLocaleDateString()}
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
                <EditProjectForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    item={selectedItem}
                />
            )}
        </div>
    );
}

export default ProjectsTable;
