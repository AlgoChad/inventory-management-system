import React from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ToolModel } from "@/data/models/tool/ToolModel";

interface WarehouseListProps {
    tools: ToolModel[];
    totalTools: number;
    onToolSelect: (tool: ToolModel) => void;
}

const WarehouseList: React.FC<WarehouseListProps> = ({ tools, totalTools, onToolSelect }) => {
    const renderToolItem = ({ item }: { item: ToolModel }) => (
        <TouchableOpacity style={styles.row} onPress={() => onToolSelect(item)}>
            <Text style={styles.cell}>{item.toolNumber}</Text>
            <Text style={styles.cell}>{item.toolName.length > 20 ? `${item.toolName.substring(0, 20)}...` : item.toolName}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Tool Number</Text>
                <Text style={styles.headerCell}>Tool Name</Text>
                <Text style={styles.headerCell}>Quantity</Text>
            </View>
            <FlatList
                data={tools}
                renderItem={renderToolItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.totalRow}>
                <Text style={styles.totalText}>Total Tools: {totalTools}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        backgroundColor: "#2f5f7c",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    headerCell: {
        flex: 1,
        padding: 4,
        fontWeight: "bold",
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#fff",
        borderRadius: 8,
        marginVertical: 4,
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cell: {
        flex: 1,
        padding: 4,
        fontSize: 12,
        color: "#000",
        textAlign: "center",
    },
    totalRow: {
        flexDirection: "row",
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: "#000",
        backgroundColor: "#2f5f7c",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginTop: 8,
    },
    totalText: {
        flex: 1,
        padding: 4,
        fontWeight: "bold",
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
    },
});

export default WarehouseList;
