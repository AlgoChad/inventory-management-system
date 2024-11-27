import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, TextInput } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ToolRequestService from "@/core/services/ToolRequestService";
import { ToolModel, ToolRepairRequest, CreateToolRepairRequestModel } from "@/data/models/tool/ToolModel";
import ToolService from "@/core/services/ToolService";
import ToolRepairRequestModal from "~/components/tool-repair/ToolRepairRequestModal";
import ViewEditToolRepairRequestModal from "~/components/tool-repair/ViewEditToolRepairRequestModal";
import ToolRepairRequestList from "~/components/tool-repair/ToolRepairRequestList";

const buttonColor = "#fca923"; // Orange color from the navbar buttons

const ToolRepairPage = () => {
    const [toolRepairRequests, setToolRepairRequests] = useState<ToolRepairRequest[]>([]);
    const [tools, setTools] = useState<ToolModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewEditModalVisible, setViewEditModalVisible] = useState(false);
    const [currentRequest, setCurrentRequest] = useState<ToolRepairRequest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchToolRepairRequests(currentPage, searchTerm);
        fetchTools();
    }, [currentPage, searchTerm]);

    const fetchToolRepairRequests = async (page: number, search: string = "") => {
        setLoading(true);
        try {
            const response = await ToolRequestService.getAllToolRepairRequests(page, 10, search);
            if (response.data) {
                setToolRepairRequests(response.data.list);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                throw new Error("Failed to load data");
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTools = async () => {
        try {
            const response = await ToolService.getAllTools();
            if (response.data) {
                setTools(response.data);
            } else {
                throw new Error("Failed to load tools");
            }
        } catch (error) {
            console.error("Failed to fetch tools:", error);
        }
    };

    const handleCreateRepairRequest = async (data: CreateToolRepairRequestModel) => {
        try {
            const response = await ToolRequestService.createToolRepairRequest(data);
            if (response.data) {
                setModalVisible(false);
                fetchToolRepairRequests(currentPage, searchTerm); // Fetch updated tool repair requests
            } else {
                throw new Error("Failed to create tool repair request");
            }
        } catch (error) {
            console.error("Failed to create tool repair request:", error);
        }
    };

    const handleEditRequest = async (id: number, description: string, personnelId: number) => {
        try {
            const response = await ToolRequestService.updateToolRepairRequest(id, { description, personnelId });
            if (response.data) {
                const updatedRequests = toolRepairRequests.map((request) =>
                    request.id === id ? { ...request, description, personnel: { ...request.personnel, id: personnelId } } : request
                );
                setToolRepairRequests(updatedRequests);
                setViewEditModalVisible(false);
            } else {
                throw new Error("Failed to update tool repair request");
            }
        } catch (error) {
            console.error("Failed to update tool repair request:", error);
        }
    };

    const handleViewEditRequest = (request: ToolRepairRequest) => {
        setCurrentRequest(request);
        setViewEditModalVisible(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchToolRepairRequests(page, searchTerm); // Fetch updated tool repair requests
    };

    const handleSearchChange = (text: string) => {
        setSearchTerm(text);
    };

    return (
        <ParallaxScrollView
            headerImage={<View style={styles.parallaxHeader}><Text style={styles.parallaxHeaderText}>Tool Repair Requests</Text></View>}
            headerBackgroundColor={{ dark: "#2f5f7c", light: "#2f5f7c" }}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search tool repair requests..."
                        value={searchTerm}
                        onChangeText={handleSearchChange}
                    />
                    <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.createButtonText}>Create Tool Repair Request</Text>
                    </TouchableOpacity>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <ToolRepairRequestList
                            toolRepairRequests={toolRepairRequests}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onViewEditRequest={handleViewEditRequest}
                        />
                    )}
                </View>
                <ToolRepairRequestModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onCreate={handleCreateRepairRequest}
                    tools={tools}
                />
                {currentRequest && (
                    <ViewEditToolRepairRequestModal
                        visible={viewEditModalVisible}
                        onClose={() => setViewEditModalVisible(false)}
                        request={currentRequest}
                        onEdit={handleEditRequest}
                    />
                )}
            </SafeAreaView>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
        marginBottom: 128, // Adjust this value to ensure it doesn't overlap with the tab bar
    },
    content: {
        flex: 1,
        padding: 16,
    },
    parallaxHeader: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2f5f7c',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    parallaxHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    createButton: {
        backgroundColor: buttonColor,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ToolRepairPage;
