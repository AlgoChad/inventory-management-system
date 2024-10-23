import { useState, useEffect } from "react";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface PaginatedGroups {
    [key: string]: CheckinModel[];
}

interface UseFetchProjectSpecificsProps {
    checkins: CheckinModel[];
    tools: ToolModel[];
}

const useFetchProjectSpecifics = ({ checkins, tools }: UseFetchProjectSpecificsProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [paginatedGroups, setPaginatedGroups] = useState<PaginatedGroups>({});
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!Array.isArray(tools) || !Array.isArray(checkins)) {
            return;
        }

        const groupedTools = checkins.reduce((acc: { [key: string]: CheckinModel[] }, checkin: CheckinModel) => {
            const projectId = checkin.project.id;
            if (!acc[projectId]) {
                acc[projectId] = [];
            }
            acc[projectId].push(checkin);
            return acc;
        }, {});

        const totalGroups = Object.keys(groupedTools).length;
        setTotalPages(Math.ceil(totalGroups / pageSize));

        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginated = Object.keys(groupedTools)
            .slice(start, end)
            .reduce((acc: PaginatedGroups, key: string) => {
                acc[key] = groupedTools[key];
                return acc;
            }, {});

        setPaginatedGroups(paginated);
    }, [checkins, tools, currentPage, pageSize]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return {
        paginatedGroups,
        currentPage,
        totalPages,
        handlePageChange,
        setPageSize,
    };
};

export default useFetchProjectSpecifics;
