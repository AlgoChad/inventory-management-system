import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { ToolModel } from "~/data/models/tool/ToolModel";

interface WarehouseListProps {
    tools: ToolModel[];
    totalTools: number;
}

const WarehouseList: React.FC<WarehouseListProps> = ({ tools, totalTools }) => {
    const renderToolItem = ({ item }: { item: ToolModel }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.toolNumber}</Text>
            <Text style={styles.cell}>{item.toolName}</Text>
            <Text style={styles.cell}>{item.quantity}</Text>
            <Text style={styles.cell}>{item.condition.name}</Text>
            <Text style={styles.cell}>{item.status.name}</Text>
            <Text style={styles.cell}>{item.personnel.name}</Text>
        </View>
    );

    return (
        <ScrollView horizontal>
            <View>
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Tool Number</Text>
                    <Text style={styles.headerCell}>Tool Name</Text>
                    <Text style={styles.headerCell}>Quantity</Text>
                    <Text style={styles.headerCell}>Condition</Text>
                    <Text style={styles.headerCell}>Status</Text>
                    <Text style={styles.headerCell}>Personnel</Text>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        backgroundColor: "#f0f0f0",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    headerCell: {
        flex: 1,
        padding: 4,
        fontWeight: "bold",
        fontSize: 14,
        color: "#000",
        textAlign: "center",
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
    totalRow: {
        flexDirection: "row",
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: "#000",
        backgroundColor: "#f0f0f0",
    },
    totalText: {
        flex: 1,
        padding: 4,
        fontWeight: "bold",
        fontSize: 14,
        color: "#000",
        textAlign: "center",
    },
});

export default WarehouseList;
