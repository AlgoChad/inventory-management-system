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
    [projectId: number]: {
        projectDescription: string;
        tools: ToolModel[];
    };
}

const useFetchTools = (loaderData: LoaderData) => {
    const [tools, setTools] = useState<ToolModel[]>(Array.isArray(loaderData.tools.data) ? loaderData.tools.data : []);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(4); // Page size for groups
    const [paginatedGroups, setPaginatedGroups] = useState<GroupedTools>({});
    const [totalPages, setTotalPages] = useState<number>(0);

    const groupByProject = (tools: ToolModel[]): GroupedTools => {
        return tools.reduce((acc, tool) => {
            const projectId = tool.projectId ?? -1;
            if (!acc[projectId]) {
                acc[projectId] = {
                    projectDescription: tool.project.projectDescription,
                    tools: [],
                };
            }
            acc[projectId].tools.push(tool);
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
        const groupedTools = groupByProject(tools);
        setTotalPages(Math.ceil(Object.keys(groupedTools).length / pageSize));
        setPaginatedGroups(paginateGroups(groupedTools, currentPage, pageSize));
    }, [tools, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const groupedTools = groupByProject(tools);
        setPaginatedGroups(paginateGroups(groupedTools, page, pageSize));
    };

    return { paginatedGroups, currentPage, totalPages, handlePageChange, setPageSize };
};

export default useFetchTools;
