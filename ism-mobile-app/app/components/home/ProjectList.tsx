import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckinModel } from "@/data/models/checkin/CheckinModel";
import ToolDetailModal from "./ToolDetailModal";
import ToolList from "./ToolList";

interface ProjectListProps {
    groupedTools: { [key: string]: CheckinModel[] };
}

const ProjectList: React.FC<ProjectListProps> = ({ groupedTools }) => {
    const [selectedTool, setSelectedTool] = useState<CheckinModel | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const sections = Object.keys(groupedTools).map((projectId) => ({
        title: groupedTools[projectId][0].project.projectName,
        data: groupedTools[projectId],
        color: groupedTools[projectId][0].project.color,
        projectId,
    }));

    const renderSectionHeader = ({ section }: { section: any }) => (
        <View style={styles.projectCardHeader}>
            <Text style={[styles.projectTitle, { borderBottomColor: section.color }]}>
                {section.title}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sections}
                renderItem={({ item }) => (
                    <View style={styles.projectCard}>
                        {renderSectionHeader({ section: item })}
                        <ToolList
                            tools={item.data}
                            projectId={item.projectId}
                            onToolSelect={(tool) => {
                                setSelectedTool(tool);
                                setIsModalVisible(true);
                            }}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.title}
            />
            {selectedTool && (
                <ToolDetailModal
                    visible={isModalVisible}
                    tool={selectedTool}
                    onClose={() => setIsModalVisible(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 36, // Adjust this value to ensure it doesn't overlap with the nav bar
    },
    projectCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 8,
        margin: 8,
        height: 220, // Adjusted height to accommodate pagination
    },
    projectCardHeader: {
        marginBottom: 4,
    },
    projectCardContent: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
        borderBottomWidth: 2,
        paddingBottom: 2,
    },
});

export default ProjectList;
