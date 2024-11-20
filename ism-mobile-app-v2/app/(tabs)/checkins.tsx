import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    ScrollView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import CheckinService from "~/core/services/CheckinService";
import ToolService from "~/core/services/ToolService";
import ProjectService from "~/core/services/ProjectService";
import {
    CheckinModel,
    CreateCheckinModel,
} from "~/data/models/checkin/CheckinModel";
import { ToolModel } from "~/data/models/tool/ToolModel";
import { ProjectModel } from "~/data/models/project/ProjectModel";
import { TabBarIcon } from "~/components/navigation/TabBarIcon";

const CheckinsDataTable = () => {
    const [data, setData] = useState<CheckinModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tools, setTools] = useState<ToolModel[]>([]);
    const [projects, setProjects] = useState<ProjectModel[]>([]);
    const [newCheckin, setNewCheckin] = useState<CreateCheckinModel>({
        toolId: 0,
        projectId: 0,
        checkInDate: new Date(),
        checkInColor: "",
        checkInQuantity: 0,
        tool: undefined,
        project: undefined,
    });
    const [editingCheckin, setEditingCheckin] = useState<CheckinModel | null>(null);

    useEffect(() => {
        fetchData(page);
        fetchTools();
        fetchProjects();
    }, [page]);

    const fetchData = async (page: number) => {
        setLoading(true);
        try {
            const response = await CheckinService.getAllCheckinsPaged({
                page,
                limit: 10,
                column: "createdAt",
                direction: "asc",
            });

            if (!response.data) {
                throw new Error("Failed to load data");
            }

            setData(response.data.list);
            setTotalPages(response.data.pagination.totalPages);
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
    };

    const handleCreate = async () => {
        try {
            const projectResponse = await ProjectService.getProjectById(newCheckin.projectId);
            if (!projectResponse.data) {
                throw new Error("Failed to fetch project details");
            }

            const response = await CheckinService.createCheckin({
                ...newCheckin,
                checkInColor: projectResponse.data.color,
            });

            if (response.data) {
                setData([response.data, ...data]);
            } else {
                throw new Error("Failed to create check-in");
            }
            setNewCheckin({
                toolId: 0,
                projectId: 0,
                checkInDate: new Date(),
                checkInColor: "",
                checkInQuantity: 0,
                tool: undefined,
                project: undefined,
            });
        } catch (error) {
            console.error("Failed to create check-in:", error);
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editingCheckin) return;
        try {
            const projectResponse = await ProjectService.getProjectById(editingCheckin.projectId);
            if (!projectResponse.data) {
                throw new Error("Failed to fetch project details");
            }

            const response = await CheckinService.updateCheckin(id, {
                ...editingCheckin,
                checkInColor: projectResponse.data.color,
            });

            if (response.data) {
                setData(data.map(item => (item.id === id && response.data ? response.data : item)));
            }
            setEditingCheckin(null);
        } catch (error) {
            console.error("Failed to update check-in:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await CheckinService.deleteCheckin(id);
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to delete check-in:", error);
        }
    };

    const handleCheckout = async (id: number) => {
        try {
            await CheckinService.checkoutCheckin(id);
            fetchData(page);
        } catch (error) {
            console.error("Failed to checkout check-in:", error);
        }
    };

    const renderItem = ({ item }: { item: CheckinModel }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.toolId}</Text>
            <Text style={styles.cell}>{item.projectId}</Text>
            <Text style={styles.cell}>{item.checkInQuantity}</Text>
            <Text style={styles.cell}>
                {new Date(item.checkInDate).toLocaleDateString()}
            </Text>
            <Text style={styles.cell}>
                {item.checkOutDate ? new Date(item.checkOutDate).toLocaleDateString() : "N/A"}
            </Text>
            <View style={styles.actionCell}>
                <TouchableOpacity onPress={() => setEditingCheckin(item)} style={styles.iconButton}>
                    <TabBarIcon name="pencil" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                    <TabBarIcon name="trash" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCheckout(item.id)} style={styles.iconButton}>
                    <TabBarIcon name="checkbox" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView horizontal>
                    <View style={styles.card}>
                        <View style={styles.headerRow}>
                            <Text style={styles.headerCell}>ID</Text>
                            <Text style={styles.headerCell}>Tool ID</Text>
                            <Text style={styles.headerCell}>Project ID</Text>
                            <Text style={styles.headerCell}>Quantity</Text>
                            <Text style={styles.headerCell}>Check-In Date</Text>
                            <Text style={styles.headerCell}>Check-Out Date</Text>
                            <Text style={styles.headerCell}>Actions</Text>
                        </View>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            onEndReached={() => {
                                if (page < totalPages) {
                                    setPage(page + 1);
                                }
                            }}
                            onEndReachedThreshold={0.5}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No data available</Text>
                                </View>
                            )}
                        />
                    </View>
                </ScrollView>
            )}
            {!editingCheckin && (
                <View style={styles.form}>
                    <Text style={styles.label}>Tool</Text>
                    <RNPickerSelect
                        onValueChange={(value: any) => setNewCheckin({ ...newCheckin, toolId: value })}
                        items={tools.map((tool) => ({ label: tool.toolName, value: tool.id }))}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select Tool", value: 0 }}
                        value={newCheckin.toolId}
                    />
                    <Text style={styles.label}>Project</Text>
                    <RNPickerSelect
                        onValueChange={(value: any) => setNewCheckin({ ...newCheckin, projectId: value })}
                        items={projects.map((project) => ({ label: project.projectName, value: project.id }))}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select Project", value: 0 }}
                        value={newCheckin.projectId}
                    />
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Quantity"
                        value={newCheckin.checkInQuantity.toString()}
                        onChangeText={(text) => setNewCheckin({ ...newCheckin, checkInQuantity: parseInt(text, 10) })}
                    />
                    <Button title="Create" onPress={handleCreate} color="#000" />
                </View>
            )}
            {editingCheckin && (
                <View style={styles.form}>
                    <Text style={styles.label}>Tool</Text>
                    <RNPickerSelect
                        onValueChange={(value: any) => setEditingCheckin({ ...editingCheckin, toolId: value })}
                        items={tools.map((tool) => ({ label: tool.toolName, value: tool.id }))}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select Tool", value: 0 }}
                        value={editingCheckin.toolId}
                    />
                    <Text style={styles.label}>Project</Text>
                    <RNPickerSelect
                        onValueChange={(value: any) => setEditingCheckin({ ...editingCheckin, projectId: value })}
                        items={projects.map((project) => ({ label: project.projectName, value: project.id }))}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select Project", value: 0 }}
                        value={editingCheckin.projectId}
                    />
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Quantity"
                        value={editingCheckin.checkInQuantity.toString()}
                        onChangeText={(text) => setEditingCheckin({ ...editingCheckin, checkInQuantity: parseInt(text, 10) })}
                    />
                    <Button title="Update" onPress={() => handleUpdate(editingCheckin.id)} color="#000" />
                    <Button title="Cancel" onPress={() => setEditingCheckin(null)} color="#000" />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 64,
        backgroundColor: "#f8f8f8",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
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
    },
    actionCell: {
        flexDirection: "row",
        justifyContent: "space-around",
        flex: 1,
    },
    iconButton: {
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    emptyText: {
        color: "#000",
        fontSize: 14,
    },
    form: {
        marginTop: 16,
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    label: {
        fontSize: 14,
        color: "#000",
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        color: "#000",
        paddingRight: 30,
        marginBottom: 8,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: "#ccc",
        borderRadius: 4,
        color: "#000",
        paddingRight: 30,
        marginBottom: 8,
    },
});

export default CheckinsDataTable;
