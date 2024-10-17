import { useState, useEffect } from "react";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface LoaderData {
    tools: {
        status: string;
        message: string;
        data: ToolModel[];
    };
}

interface GroupedTools {
    [key: string]: ToolModel[];
}

const useFetchToolsByStatusAndCondition = (loaderData: LoaderData) => {
    const [tools, setTools] = useState<ToolModel[]>(Array.isArray(loaderData.tools.data) ? loaderData.tools.data : []);
    const [statusPage, setStatusPage] = useState<number>(1);
    const [conditionPage, setConditionPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(6); // Page size for groups
    const [paginatedStatusGroups, setPaginatedStatusGroups] = useState<GroupedTools>({});
    const [paginatedConditionGroups, setPaginatedConditionGroups] = useState<GroupedTools>({});
    const [totalStatusPages, setTotalStatusPages] = useState<number>(0);
    const [totalConditionPages, setTotalConditionPages] = useState<number>(0);

    const groupByStatus = (tools: ToolModel[]): GroupedTools => {
        return tools.reduce((acc, tool) => {
            const status = tool.status.name ?? "Unknown";
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(tool);
            return acc;
        }, {} as GroupedTools);
    };

    const groupByCondition = (tools: ToolModel[]): GroupedTools => {
        return tools.reduce((acc, tool) => {
            const condition = tool.condition.name ?? "Unknown";
            if (!acc[condition]) {
                acc[condition] = [];
            }
            acc[condition].push(tool);
            return acc;
        }, {} as GroupedTools);
    };

    const paginateGroups = (groups: GroupedTools, page: number, size: number): GroupedTools => {
        const groupEntries = Object.entries(groups);
        const start = (page - 1) * size;
        const end = start + size;
        const paginatedEntries = groupEntries.slice(start, end);
        return Object.fromEntries(paginatedEntries);
    };

    useEffect(() => {
        const groupedByStatus = groupByStatus(tools);
        const groupedByCondition = groupByCondition(tools);
        setTotalStatusPages(Math.ceil(Object.keys(groupedByStatus).length / pageSize));
        setTotalConditionPages(Math.ceil(Object.keys(groupedByCondition).length / pageSize));
        setPaginatedStatusGroups(paginateGroups(groupedByStatus, statusPage, pageSize));
        setPaginatedConditionGroups(paginateGroups(groupedByCondition, conditionPage, pageSize));
    }, [tools, statusPage, conditionPage, pageSize]);

    const handleStatusPageChange = (page: number) => {
        setStatusPage(page);
        const groupedByStatus = groupByStatus(tools);
        setPaginatedStatusGroups(paginateGroups(groupedByStatus, page, pageSize));
    };

    const handleConditionPageChange = (page: number) => {
        setConditionPage(page);
        const groupedByCondition = groupByCondition(tools);
        setPaginatedConditionGroups(paginateGroups(groupedByCondition, page, pageSize));
    };

    return { 
        paginatedStatusGroups, 
        paginatedConditionGroups, 
        statusPage, 
        conditionPage, 
        totalStatusPages, 
        totalConditionPages, 
        handleStatusPageChange, 
        handleConditionPageChange, 
        setPageSize 
    };
};

export default useFetchToolsByStatusAndCondition;
