import { useState, useEffect } from "react";
import { CheckinModel } from "~/data/models/checkin/CheckinModel";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface Groups {
    [key: string]: CheckinModel[];
}

interface UseFetchProjectSpecificsProps {
    checkins: CheckinModel[];
    tools: ToolModel[];
}

const useFetchProjectSpecifics = ({ checkins, tools }: UseFetchProjectSpecificsProps) => {
    const [groupedTools, setGroupedTools] = useState<Groups>({});

    useEffect(() => {
        if (!Array.isArray(tools) || !Array.isArray(checkins)) {
            return;
        }

        const grouped = checkins.reduce((acc: { [key: string]: CheckinModel[] }, checkin: CheckinModel) => {
            const projectId = checkin.project.id;
            if (!acc[projectId]) {
                acc[projectId] = [];
            }
            acc[projectId].push(checkin);
            return acc;
        }, {});

        setGroupedTools(grouped);
    }, [checkins, tools]);

    return {
        groupedTools,
    };
};

export default useFetchProjectSpecifics;
