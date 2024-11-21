import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CheckinModel } from "@/data/models/checkin/CheckinModel";
import { Ionicons } from '@expo/vector-icons';

interface ToolDetailModalProps {
    visible: boolean;
    tool: CheckinModel;
    onClose: () => void;
}

const ToolDetailModal: React.FC<ToolDetailModalProps> = ({ visible, tool, onClose }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
            transparent
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{tool.tool.toolName}</Text>
                    <Text style={styles.modalText}>Quantity: {tool.checkInQuantity}</Text>
                    <Text style={styles.modalText}>Status: {tool.checkOutDate ? "Checked Out" : "Checked In"}</Text>
                    <View style={styles.colorContainer}>
                        <Text style={styles.modalText}>Check-in Color:</Text>
                        <View style={[styles.colorDot, { backgroundColor: tool.checkInColor }]} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
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
    colorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: 8,
    },
});

export default ToolDetailModal;
