import React from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { ToolRequest } from "@/data/models/tool/ToolModel";
import { Pagination } from "@/components/app/utils/Pagination";

interface ToolRequestListProps {
    toolRequests: ToolRequest[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onViewEditRequest: (request: ToolRequest) => void;
}

const ToolRequestList: React.FC<ToolRequestListProps> = ({ toolRequests, currentPage, totalPages, onPageChange, onViewEditRequest }) => {
    return (
        <View style={styles.listContainer}>
            <FlatList
                data={toolRequests}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                        <Text style={styles.requestText}>Tool Name: {item.tool?.toolName || "N/A"}</Text>
                        <Text style={styles.requestText}>Quantity: {item.quantity}</Text>
                        <Text style={styles.requestText}>Personnel: {item.personnel?.name || "N/A"}</Text>
                        <Text style={styles.requestText}>Status: {item.status}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={() => onViewEditRequest(item)}>
                            <Text style={styles.editButtonText}>View/Edit</Text>
                        </TouchableOpacity>
                    </View>
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
    editButton: {
        backgroundColor: "#fca923",
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ToolRequestList;
