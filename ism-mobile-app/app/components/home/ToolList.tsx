import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckinModel } from "@/data/models/checkin/CheckinModel";
import { Pagination } from "@/components/app/utils/Pagination";

interface ToolListProps {
    tools: CheckinModel[];
    projectId: string;
    onToolSelect: (tool: CheckinModel) => void;
}

const ITEMS_PER_PAGE = 5;

const ToolList: React.FC<ToolListProps> = ({ tools, projectId, onToolSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const renderItem = ({ item }: { item: CheckinModel }) => (
        <TouchableOpacity
            key={item.id} // Ensure each item has a unique key
            style={styles.row}
            onPress={() => onToolSelect(item)}
        >
            <Text style={styles.cell}>{item.tool.toolName.length > 20 ? `${item.tool.toolName.substring(0, 20)}...` : item.tool.toolName}</Text>
            <Text style={styles.cell}>{item.checkInQuantity}</Text>
            <View style={[styles.colorDot, { backgroundColor: item.checkInColor }]} />
        </TouchableOpacity>
    );

    const page = currentPage;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTools = tools.slice(startIndex, endIndex);
    const totalPages = Math.ceil(tools.length / ITEMS_PER_PAGE);

    return (
        <View>
            {paginatedTools.map((tool) => renderItem({ item: tool }))}
            <View style={{ marginTop: 15 }}>
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage: any) => setCurrentPage(newPage)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    cell: {
        flex: 1,
        padding: 2,
        fontSize: 10,
        color: "#000",
        textAlign: "center",
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
    },
});

export default ToolList;
