import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    ActivityIndicator,
    View,
    SafeAreaView,
} from "react-native";
import CheckinService from "@/core/services/CheckinService";
import ToolService from "@/core/services/ToolService";
import { CheckinModel } from "@/data/models/checkin/CheckinModel";
import { ToolModel } from "@/data/models/tool/ToolModel";
import WarehouseModal from "~/components/home/WarehouseModal";
import ProjectsModal from "~/components/home/ProjectModal";


const HomeScreen = () => {
    const [tools, setTools] = useState<ToolModel[]>([]);
    const [checkins, setCheckins] = useState<CheckinModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const toolsResponse = await ToolService.getAllTools();
            const checkinsResponse = await CheckinService.getAllCheckins();

            if (toolsResponse.data && checkinsResponse.data) {
                setTools(toolsResponse.data);
                setCheckins(checkinsResponse.data);
            } else {
                throw new Error("Failed to load data");
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupedTools = checkins.reduce((acc: { [key: string]: CheckinModel[] }, checkin) => {
        const projectId = checkin.projectId.toString();
        if (!acc[projectId]) {
            acc[projectId] = [];
        }
        acc[projectId].push(checkin);
        return acc;
    }, {});

    const totalTools = tools.reduce((sum, tool) => sum + tool.quantity, 0);

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <WarehouseModal tools={tools} totalTools={totalTools} />
                    <ProjectsModal groupedTools={groupedTools} />
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 64,
        backgroundColor: "#f8f8f8",
        marginBottom: 96,
    },
});

export default HomeScreen;
