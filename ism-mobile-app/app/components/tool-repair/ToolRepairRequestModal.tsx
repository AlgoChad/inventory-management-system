import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity, Button, FlatList, Image, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ToolModel, CreateToolRepairRequestModel, ImageModel } from "@/data/models/tool/ToolModel";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import PersonnelService from "@/core/services/PersonnelService";
import { PersonnelModel } from "@/data/models/personnel/PersonnelModel";
import { Ionicons } from '@expo/vector-icons';

interface ToolRepairRequestModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (data: CreateToolRepairRequestModel) => void;
    tools: ToolModel[];
}

const buttonColor = "#fca923"; // Orange color from the navbar buttons

const ToolRepairRequestModal: React.FC<ToolRepairRequestModalProps> = ({ visible, onClose, onCreate, tools }) => {
    const [toolId, setToolId] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [quantity, setQuantity] = useState<number | null>(null);
    const [images, setImages] = useState<ImageModel[]>([]);
    const [personnel, setPersonnel] = useState<PersonnelModel[]>([]);
    const [personnelId, setPersonnelId] = useState<number | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            }
        })();
        fetchPersonnel();
    }, []);

    const fetchPersonnel = async () => {
        try {
            const response = await PersonnelService.getAllPersonnel();
            if (response.data) {
                setPersonnel(response.data);
            } else {
                throw new Error("Failed to load personnel");
            }
        } catch (error) {
            console.error("Failed to fetch personnel:", error);
        }
    };

    const handleCreate = () => {
        if (toolId && description && quantity && personnelId) {
            onCreate({
                toolId,
                description,
                images,
                quantity,
                personnelId
            });
            setToolId(null);
            setDescription("");
            setQuantity(null);
            setImages([]);
            setPersonnelId(null);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            const newImage: ImageModel = {
                id: Date.now(),
                name: uri.split('/').pop() || 'image',
                base64: base64 || '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setImages([...images, newImage]);
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
                    <Text style={styles.modalTitle}>Create Tool Repair Request</Text>
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
                    <TextInput
                        style={styles.input}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter quantity"
                        value={quantity ? quantity.toString() : ""}
                        onChangeText={(text) => setQuantity(Number(text))}
                        keyboardType="numeric"
                    />
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    <FlatList
                        data={images}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: `data:image/jpeg;base64,${item.base64}` }} style={styles.image} />
                        )}
                        horizontal
                    />
                    <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                        <Text style={styles.createButtonText}>Create</Text>
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
    createButton: {
        backgroundColor: buttonColor,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: "100%",
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 8,
        borderRadius: 8,
    },
});

export default ToolRepairRequestModal;
