import React from "react";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { ScrollArea } from "~/components/ui/scroll-area";

interface GroupedToolCardsProps {
    groupedTools: {
        [key: string]: ToolModel[];
    };
    title: string;
}

const GroupedToolCards: React.FC<GroupedToolCardsProps> = ({
    groupedTools,
    title,
}) => {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(groupedTools).map(([key, tools]) => (
                    <div
                        key={key}
                        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 max-h-90"
                    >
                        <h3 className="text-xl font-bold mb-2 text-black">
                            {key}
                        </h3>
                        <ul>
                            <ScrollArea className="max-h-80 overflow-y-auto">
                                {tools.map((tool) => (
                                    <li
                                        key={tool.id}
                                        className="bg-gray-100 p-2 m-2 rounded-lg shadow-sm flex items-center text-sm"
                                    >
                                        <span className="font-bold mr-2">
                                            {tool.toolNumber}
                                        </span>
                                        <span>{tool.toolDescription}</span>
                                    </li>
                                ))}
                            </ScrollArea>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupedToolCards;
