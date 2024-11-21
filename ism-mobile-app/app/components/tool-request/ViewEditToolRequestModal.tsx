import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ToolModel, ToolRequest } from "@/data/models/tool/ToolModel";
import { PersonnelModel } from "@/data/models/personnel/PersonnelModel";
import { ProjectModel } from "@/data/models/project/ProjectModel";
import { Ionicons } from '@expo/vector-icons';

interface ViewEditToolRequestModalProps {
    visible: boolean;
    onClose: () => void;
    onEdit: (id: number, toolId: number, quantity: number, personnelId: number, projectId: number) => void;
    tools: ToolModel[];
    personnel: PersonnelModel[];
    projects: ProjectModel[];
    request: ToolRequest;
}

const buttonColor = "#fca923"; // Orange color from the navbar buttons

const ViewEditToolRequestModal: React.FC<ViewEditToolRequestModalProps> = ({ visible, onClose, onEdit, tools, personnel, projects, request }) => {
    const [toolId, setToolId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number | null>(null);
    const [personnelId, setPersonnelId] = useState<number | null>(null);
    const [projectId, setProjectId] = useState<number | null>(null);

    useEffect(() => {
        if (request) {
            setToolId(request.toolId);
            setQuantity(request.quantity);
            setPersonnelId(request.personnelId);
            setProjectId(request.projectId);
        }
    }, [request]);

    const handleEdit = () => {
        if (toolId && quantity && personnelId && projectId) {
            onEdit(request.id, toolId, quantity, personnelId, projectId);
        }
    };

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
                    <Text style={styles.modalTitle}>View/Edit Tool Request</Text>
                    <Picker
                        selectedValue={toolId}
                        onValueChange={(itemValue: React.SetStateAction<number | null>) => setToolId(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Tool" value={null} />
                        {tools.map((tool) => (
                            <Picker.Item key={tool.id} label={tool.toolName} value={tool.id} />
                        ))}
                    </Picker>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter quantity"
                        value={quantity ? quantity.toString() : ""}
                        onChangeText={(text) => setQuantity(Number(text))}
                        keyboardType="numeric"
                    />
                    <Picker
                        selectedValue={personnelId}
                        onValueChange={(itemValue: React.SetStateAction<number | null>) => setPersonnelId(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Personnel" value={null} />
                        {personnel.map((person) => (
                            <Picker.Item key={person.id} label={person.name} value={person.id} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={projectId}
                        onValueChange={(itemValue: React.SetStateAction<number | null>) => setProjectId(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Project" value={null} />
                        {projects.map((project) => (
                            <Picker.Item key={project.id} label={project.projectName} value={project.id} />
                        ))}
                    </Picker>
                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                        <Text style={styles.editButtonText}>Save Changes</Text>
                    </TouchableOpacity>
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
    closeButtonText: {
        fontSize: 18,
        color: "#000",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#000",
    },
    picker: {
        height: 50,
        width: "100%",
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        width: "100%",
    },
    editButton: {
        backgroundColor: buttonColor,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: "100%",
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ViewEditToolRequestModal;
