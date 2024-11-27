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
} from "react-native";
import StatusTypeService from "@/core/services/StatusTypeService"; // Adjust the import path as needed
import {
    StatusTypeModel,
    CreateStatusTypeModel,
} from "@/data/models/status-type/StatusTypeModel";
import { TabBarIcon } from "@/components/navigation/TabBarIcon"; // Import TabBarIcon

const StatusTypesDataTable = () => {
    const [data, setData] = useState<StatusTypeModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [newStatusType, setNewStatusType] = useState<CreateStatusTypeModel>({ name: '' });
    const [editingStatusType, setEditingStatusType] = useState<StatusTypeModel | null>(null);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const fetchData = async (page: number) => {
        setLoading(true);
        try {
            const response = await StatusTypeService.getAllStatusTypesPaged({
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

    const handleCreate = async () => {
        try {
            const response = await StatusTypeService.createStatusType(newStatusType);
            if (response.data) {
                setData([response.data, ...data]);
            } else {
                throw new Error("Failed to create status type");
            }
            setNewStatusType({ name: '' });
        } catch (error) {
            console.error("Failed to create status type:", error);
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editingStatusType) return;
        try {
            const response = await StatusTypeService.updateStatusType(id, editingStatusType);
            if (response.data) {
                setData(data.map(item => (item.id === id && response.data ? response.data : item)));
            }
            setEditingStatusType(null);
        } catch (error) {
            console.error("Failed to update status type:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await StatusTypeService.deleteStatusType(id);
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to delete status type:", error);
        }
    };

    const renderItem = ({ item }: { item: StatusTypeModel }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.cell}>
                {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
            <View style={styles.actionCell}>
                <TouchableOpacity onPress={() => setEditingStatusType(item)} style={styles.iconButton}>
                    <TabBarIcon name="pencil" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                    <TabBarIcon name="trash" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerCell}>ID</Text>
                        <Text style={styles.headerCell}>Name</Text>
                        <Text style={styles.headerCell}>Created At</Text>
                        <Text style={styles.headerCell}>Updated At</Text>
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
                    {!editingStatusType && (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Status Type Name"
                                value={newStatusType.name}
                                onChangeText={(text) => setNewStatusType({ name: text })}
                            />
                            <Button title="Create" onPress={handleCreate} color="#000" />
                        </View>
                    )}
                    {editingStatusType && (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Status Type Name"
                                value={editingStatusType.name}
                                onChangeText={(text) => setEditingStatusType({ ...editingStatusType, name: text })}
                            />
                            <Button title="Update" onPress={() => handleUpdate(editingStatusType.id)} color="#000" />
                            <Button title="Cancel" onPress={() => setEditingStatusType(null)} color="#000" />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
});

export default StatusTypesDataTable;
