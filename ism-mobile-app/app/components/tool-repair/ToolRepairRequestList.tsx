import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { ToolRepairRequest } from "@/data/models/tool/ToolModel";
import { Pagination } from "@/components/app/utils/Pagination";

interface ToolRepairRequestListProps {
    toolRepairRequests: ToolRepairRequest[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onViewEditRequest: (request: ToolRepairRequest) => void;
}

const ToolRepairRequestList: React.FC<ToolRepairRequestListProps> = ({
    toolRepairRequests,
    currentPage,
    totalPages,
    onPageChange,
    onViewEditRequest,
}) => {
    return (
        <View style={styles.listContainer}>
            <FlatList
                data={toolRepairRequests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onViewEditRequest(item)}>
                        <View style={styles.requestItem}>
                            <Text style={styles.requestText}>Tool Name: {item.tool.toolName}</Text>
                            <Text style={styles.requestText}>Description: {item.description}</Text>
                            <Text style={styles.requestText}>Personnel: {item.personnel.name}</Text>
                            <Text style={styles.requestText}>Status: {item.status}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
    requestItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#fff",
        marginVertical: 4,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    requestText: {
        fontSize: 16,
        color: "#333",
    },
});

export default ToolRepairRequestList;
