import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity, FlatList, Image, TextInput, Button, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ToolRepairRequest, ImageModel } from "@/data/models/tool/ToolModel";
import PersonnelService from "@/core/services/PersonnelService";
import { PersonnelModel } from "@/data/models/personnel/PersonnelModel";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

interface ViewEditToolRepairRequestModalProps {
    visible: boolean;
    onClose: () => void;
    request: ToolRepairRequest;
    onEdit: (id: number, description: string, personnelId: number, images: ImageModel[], quantity: number) => void;
}

const buttonColor = "#fca923"; // Orange color from the navbar buttons

const ViewEditToolRepairRequestModal: React.FC<ViewEditToolRepairRequestModalProps> = ({ visible, onClose, request, onEdit }) => {
    const [description, setDescription] = useState<string>(request.description);
    const [personnel, setPersonnel] = useState<PersonnelModel[]>([]);
    const [personnelId, setPersonnelId] = useState<number>(request.personnel.id);
    const [images, setImages] = useState<ImageModel[]>(request.images);
    const [quantity, setQuantity] = useState<number>(request.quantity);

    useEffect(() => {
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

    const handleSave = () => {
        onEdit(request.id, description, personnelId, images, quantity);
        onClose();
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

    const removeImage = (id: number) => {
        setImages(images.filter(image => image.id !== id));
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
                    <Text style={styles.modalTitle}>View/Edit Tool Repair Request</Text>
                    <Text style={styles.requestText}>Tool Name: {request.tool.toolName}</Text>
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
                    <Picker
                        selectedValue={personnelId}
                        onValueChange={(itemValue: React.SetStateAction<number>) => setPersonnelId(itemValue)}
                        style={styles.picker}
                    >
                        {personnel.map((person) => (
                            <Picker.Item key={person.id} label={person.name} value={person.id} />
                        ))}
                    </Picker>
                    <FlatList
                        data={images}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: `data:image/jpeg;base64,${item.base64}` }} style={styles.image} />
                                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(item.id)}>
                                    <Text style={styles.removeButtonText}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        horizontal
                    />
                    <Button title="Add Image" onPress={pickImage} color={buttonColor} />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
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
    requestText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
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
    picker: {
        height: 50,
        width: "100%",
        marginBottom: 16,
    },
    imageContainer: {
        position: "relative",
        marginRight: 8,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: "#fff",
        fontSize: 12,
    },
    saveButton: {
        backgroundColor: buttonColor,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: "100%",
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ViewEditToolRepairRequestModal;
