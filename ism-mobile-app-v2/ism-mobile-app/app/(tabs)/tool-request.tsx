import React, { useEffect, useState } from "react";
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, TextInput } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ToolRequestService from "@/core/services/ToolRequestService";
import ToolService from "@/core/services/ToolService";
import PersonnelService from "@/core/services/PersonnelService";
import ToolRequestModal from "~/components/tool-request/ToolRequestModal";
import { ToolModel, ToolRequest } from "@/data/models/tool/ToolModel";
import { PersonnelModel } from "@/data/models/personnel/PersonnelModel";
import ToolRequestList from "~/components/tool-request/ToolRequestList";
import ViewEditToolRequestModal from "~/components/tool-request/ViewEditToolRequestModal";
import ProjectService from "@/core/services/ProjectService";
import { ProjectModel } from "@/data/models/project/ProjectModel";

const buttonColor = "#fca923"; // Orange color from the navbar buttons

const ToolRequestPage = () => {
    const [toolRequests, setToolRequests] = useState<ToolRequest[]>([]);
    const [tools, setTools] = useState<ToolModel[]>([]);
    const [personnel, setPersonnel] = useState<PersonnelModel[]>([]);
    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewEditModalVisible, setViewEditModalVisible] = useState(false);
    const [currentRequest, setCurrentRequest] = useState<ToolRequest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchToolRequests(currentPage, searchTerm);
        fetchTools();
        fetchPersonnel();
        fetchProjects();
    }, [currentPage, searchTerm]);

    const fetchToolRequests = async (page: number, search: string = "") => {
        setLoading(true);
        try {
            const response = await ToolRequestService.getAllToolRequests(page, 10, search);
            if (response.data) {
                setToolRequests(response.data.list);
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

    const fetchProjects = async () => {
        try {
            const response = await ProjectService.getAllProjects();
            if (response.data) {
                setProjects(response.data);
            } else {
                throw new Error("Failed to load projects");
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    }

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

    const handleCreateRequest = async (toolId: number, quantity: number, personnelId: number, projectId: number) => {
        try {
            const response = await ToolRequestService.createToolRequest({ toolId, quantity, personnelId, projectId });
            if (response.data) {
                setModalVisible(false);
                fetchToolRequests(currentPage, searchTerm);
            } else {
                throw new Error("Failed to create tool request");
            }
        } catch (error) {
            console.error("Failed to create tool request:", error);
        }
    };

    const handleEditRequest = async (id: number, toolId: number, quantity: number, personnelId: number, projectId: number) => {
        try {
            const response = await ToolRequestService.updateToolRequest(id, { toolId, quantity, personnelId, projectId });
            if (response.data) {
                setViewEditModalVisible(false);
                fetchToolRequests(currentPage, searchTerm);
            } else {
                throw new Error("Failed to update tool request");
            }
        } catch (error) {
            console.error("Failed to update tool request:", error);
        }
    };

    const handleViewEditRequest = (request: ToolRequest) => {
        setCurrentRequest(request);
        setViewEditModalVisible(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchToolRequests(page, searchTerm);
    };

    const handleSearchChange = (text: string) => {
        setSearchTerm(text);
    };

    return (
        <ParallaxScrollView
            headerImage={<View style={styles.parallaxHeader}><Text style={styles.parallaxHeaderText}>Tool Request</Text></View>}
            headerBackgroundColor={{ dark: "#2f5f7c", light: "#2f5f7c" }}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search tool requests..."
                        value={searchTerm}
                        onChangeText={handleSearchChange}
                    />
                    <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.createButtonText}>Create Tool Request</Text>
                    </TouchableOpacity>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <ToolRequestList
                            toolRequests={toolRequests}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onViewEditRequest={handleViewEditRequest}
                        />
                    )}
                </View>
                <ToolRequestModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onCreate={handleCreateRequest}
                    tools={tools}
                    personnel={personnel}
                    projects={projects}
                />
                {currentRequest && (
                    <ViewEditToolRequestModal
                        visible={viewEditModalVisible}
                        onClose={() => setViewEditModalVisible(false)}
                        onEdit={handleEditRequest}
                        tools={tools}
                        personnel={personnel}
                        request={currentRequest}
                        projects={projects}
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

export default ToolRequestPage;
