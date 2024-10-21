import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowDirection } from "~/components/app/custom/PaginationArrow";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { Datatable } from "~/data/models/generic/DatatableModel";
import { DataTable } from "~/components/app/custom/Datatable";
import EditCheckinForm from "./EditCheckinForm";
import { useSubmit } from "@remix-run/react";

interface CheckinTableProps {
    table: Datatable<CheckinModel>;
    projects: ProjectModel[];
    tools: ToolModel[];
}

const CheckinTable: React.FC<CheckinTableProps> = ({ table, projects, tools }) => {
    const { data, pagination, defaultSort } = table;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

    const handleDelete = (id: number) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        submit(formData, { method: "post", action: "/master-data/checkins/delete" });
    };

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
                return <div className="text-center">{rowValue.tool.toolname}</div>;
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
                        {new Date(
                            rowValue.checkInDate as unknown as string
                        ).toLocaleDateString()}
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
                            new Date(rowValue.checkOutDate as unknown as string).toLocaleDateString()
                        ) : (
                            "N/A"
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
                <EditCheckinForm
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    item={selectedItem}
                    projects={projects}
                    tools={tools}
                />
            )}
        </div>
    );
}

export default CheckinTable;
