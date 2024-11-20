import React from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { CheckinModel } from "@/data/models/checkin/CheckinModel";

interface ProjectListProps {
    groupedTools: { [key: string]: CheckinModel[] };
}

const ProjectList: React.FC<ProjectListProps> = ({ groupedTools }) => {
    const sections = Object.keys(groupedTools).map((projectId) => ({
        title: groupedTools[projectId][0].project.projectName,
        data: groupedTools[projectId],
        color: groupedTools[projectId][0].project.color,
        description: groupedTools[projectId][0].project.projectDescription,
    }));

    const renderSectionHeader = ({ section }: { section: any }) => (
        <View style={styles.projectCard}>
            <Text style={[styles.projectTitle, { borderBottomColor: section.color }]}>
                {section.title}
            </Text>
            <Text style={styles.projectDescription}>{section.description}</Text>
        </View>
    );

    const renderItem = ({ item }: { item: CheckinModel }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.tool.toolName}</Text>
            <Text style={styles.cell}>{item.checkInQuantity}</Text>
            <Text style={styles.cell}>
                {item.checkOutDate ? "Checked Out" : "Checked In"}
            </Text>
            <View style={[styles.colorDot, { backgroundColor: item.checkInColor }]} />
        </View>
    );

    return (
        <SectionList
            sections={sections}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.projectsContainer}
        />
    );
};

const styles = StyleSheet.create({
    projectsContainer: {
        marginTop: 16,
    },
    projectCard: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 16,
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        borderBottomWidth: 2,
        paddingBottom: 4,
    },
    projectDescription: {
        fontSize: 12,
        color: "#666",
        marginBottom: 8,
    },
    row: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    cell: {
        flex: 1,
        padding: 4,
        fontSize: 12,
        color: "#000",
        textAlign: "center",
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: 4,
    },
});

export default ProjectList;
