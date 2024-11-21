import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ToolModel } from "@/data/models/tool/ToolModel";
import { Ionicons } from '@expo/vector-icons';

interface ToolDetailModalProps {
    visible: boolean;
    tool: ToolModel | null;
    onClose: () => void;
}

const ToolDetailModalWarehouse: React.FC<ToolDetailModalProps> = ({ visible, tool, onClose }) => {
    if (!tool) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{tool.toolName}</Text>
                    <Text style={styles.modalText}>Tool Number: {tool.toolNumber}</Text>
                    <Text style={styles.modalText}>Quantity: {tool.quantity}</Text>
                    <Text style={styles.modalText}>Condition: {tool.condition.name}</Text>
                    <Text style={styles.modalText}>Status: {tool.status.name}</Text>
                    <Text style={styles.modalText}>Personnel: {tool.personnel.name}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        alignItems: "center",
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#000",
    },
    modalText: {
        fontSize: 16,
        marginBottom: 8,
        color: "#000",
    },
});

export default ToolDetailModalWarehouse;
