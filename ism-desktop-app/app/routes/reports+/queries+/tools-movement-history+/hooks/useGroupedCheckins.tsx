import { useState, useEffect } from "react";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";

interface GroupedCheckins {
    [toolId: number]: {
        tool: CheckinModel['tool'];
        projects: {
            projectName: string;
            projectDescription: string;
            startDate: string;
            endDate: string;
            isCheckedOut: boolean;
            checkInQuantity: number;
            checkInColor: string;
        }[];
    };
}

const useGroupedCheckins = (checkins: CheckinModel[]) => {
    const [groupedCheckins, setGroupedCheckins] = useState<GroupedCheckins>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const grouped: GroupedCheckins = checkins.reduce((acc, checkin) => {
            const { tool, project, checkInQuantity, checkInColor, checkOutDate } = checkin;
            if (!acc[tool.id]) {
                acc[tool.id] = {
                    tool,
                    projects: [],
                };
            }
            acc[tool.id].projects.push({
                projectName: project.projectName,
                projectDescription: project.projectDescription,
                startDate: project.startDate,
                endDate: project.endDate,
                isCheckedOut: checkOutDate? true : false,
                checkInQuantity,
                checkInColor,
            });
            return acc;
        }, {} as GroupedCheckins);

        Object.values(grouped).forEach((group) => {
            group.projects.sort((a: GroupedCheckins[0]['projects'][0], b: GroupedCheckins[0]['projects'][0]) => {
                const startDateA = new Date(a.startDate).getTime();
                const startDateB = new Date(b.startDate).getTime();
                const endDateA = new Date(a.endDate).getTime();
                const endDateB = new Date(b.endDate).getTime();
                return startDateA - startDateB || endDateA - endDateB;
            });
        });

        setGroupedCheckins(grouped);
    }, [checkins]);

    const totalPages = Math.ceil(Object.keys(groupedCheckins).length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const paginatedCheckins = Object.entries(groupedCheckins).slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return { paginatedCheckins, currentPage, totalPages, handlePageChange };
};

export default useGroupedCheckins;
