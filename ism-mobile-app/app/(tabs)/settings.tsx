import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import ConditionTypesDataTable from "@/app/components/settings/condition-types/ConditionTypesDatatable"; // Adjust the import path as needed
import StatusTypesDataTable from "~/components/settings/status-types/StatusTypesDatatable";

export default function Settings() {
    const [isConditionTypesModalVisible, setIsConditionTypesModalVisible] = useState(false);
    const [isStatusTypesModalVisible, setIsStatusTypesModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setIsConditionTypesModalVisible(true)}
            >
                <Text style={styles.headerText}>Condition Types</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.header}
                onPress={() => setIsStatusTypesModalVisible(true)}
            >
                <Text style={styles.headerText}>Status Types</Text>
            </TouchableOpacity>

            <Modal
                visible={isConditionTypesModalVisible}
                animationType="slide"
                onRequestClose={() => setIsConditionTypesModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Button color={"black"} title="Close" onPress={() => setIsConditionTypesModalVisible(false)} />
                    <ConditionTypesDataTable />
                </View>
            </Modal>

            <Modal
                visible={isStatusTypesModalVisible}
                animationType="slide"
                onRequestClose={() => setIsStatusTypesModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Button color={"black"} title="Close" onPress={() => setIsStatusTypesModalVisible(false)} />
                    <StatusTypesDataTable />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: 64
    },
    header: {
        backgroundColor: "#333",
        padding: 16,
        alignItems: "center",
        marginBottom: 8,
        borderRadius: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    modalContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: "#121212",
    },
});
