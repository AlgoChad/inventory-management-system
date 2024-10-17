import React from "react";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { Badge } from "~/components/ui/badge";

interface ToolTableProps {
    tools: ToolModel[];
}

const ToolTable: React.FC<ToolTableProps> = ({ tools }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md text-sm">
                <thead>
                    <tr className="bg-black text-white">
                        <th className="py-1 px-2 border-b text-left">Tool Description</th>
                        <th className="py-1 px-2 border-b text-left">Tool Number</th>
                        <th className="py-1 px-2 border-b text-left">Quantity</th>
                        <th className="py-1 px-2 border-b text-left">Condition</th>
                        <th className="py-1 px-2 border-b text-left">Status</th>
                        <th className="py-1 px-2 border-b text-left">Personnel</th>
                    </tr>
                </thead>
                <tbody>
                    {tools.map((tool: ToolModel) => (
                        <tr key={tool.id} className="hover:bg-gray-100 transition-colors duration-200">
                            <td className="py-1 px-2 border-b text-left">{tool.toolDescription}</td>
                            <td className="py-1 px-2 border-b text-left"><Badge variant="outline">{tool.toolNumber}</Badge></td>
                            <td className="py-1 px-2 border-b text-left"><Badge variant="destructive">{tool.quantity}</Badge></td>
                            <td className="py-1 px-2 border-b text-left"><Badge variant="default">{tool.condition.name}</Badge></td>
                            <td className="py-1 px-2 border-b text-left"><Badge variant="default">{tool.status.name}</Badge></td>
                            <td className="py-1 px-2 border-b text-left">{tool.personnel.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ToolTable;
