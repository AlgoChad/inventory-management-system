import React, { useState } from "react";
import { ToolModel } from "~/data/models/tool/ToolModel";
import Pagination from "~/components/app/custom/Pagination";

interface WarehouseTableProps {
    tools: ToolModel[];
    totalQuantity: number;
}

const WarehouseTable: React.FC<WarehouseTableProps> = ({ tools, totalQuantity }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(tools.length / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedTools = tools.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Tool Number
                        </th>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Tool Name
                        </th>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Available Quantity
                        </th>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Condition
                        </th>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Personnel
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTools.map((tool: ToolModel) => (
                        <tr key={tool.id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-200">{tool.toolNumber}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{tool.toolName}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{tool.quantity}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{tool.condition.name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{tool.status.name}</td>
                            <td className="px-4 py-2 border-b border-gray-200">{tool.personnel.name}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2} className="px-4 py-2 border-t border-gray-200 font-semibold">Total</td>
                        <td className="px-4 py-2 border-t border-gray-200">{totalQuantity}</td>
                        <td colSpan={3} className="border-t border-gray-200"></td>
                    </tr>
                </tfoot>
            </table>
            <div className="flex justify-end mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default WarehouseTable;
