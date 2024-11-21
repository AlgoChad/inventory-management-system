import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, SafeAreaView, Text, TextInput } from "react-native";
import ToolService from "@/core/services/ToolService";
import { ToolModel } from "@/data/models/tool/ToolModel";
import WarehouseList from "~/components/home/WarehouseList";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ToolDetailModalWarehouse from "~/components/home/ToolDetailModalWarehouse";

const Warehouse = () => {
    const [tools, setTools] = useState<ToolModel[]>([]);
    const [filteredTools, setFilteredTools] = useState<ToolModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTool, setSelectedTool] = useState<ToolModel | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredTools(tools);
        } else {
            setFilteredTools(
                tools.filter((tool) =>
                    tool.toolName.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, tools]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const toolsResponse = await ToolService.getAllTools();

            if (toolsResponse.data) {
                setTools(toolsResponse.data);
                setFilteredTools(toolsResponse.data);
            } else {
                throw new Error("Failed to load data");
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalTools = filteredTools.reduce((sum, tool) => sum + tool.quantity, 0);

    return (
        <ParallaxScrollView
            headerImage={<View style={styles.parallaxHeader}><Text style={styles.parallaxHeaderText}>Warehouse</Text></View>}
            headerBackgroundColor={{ dark: "#2f5f7c", light: "#2f5f7c" }}
        >
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={styles.content}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search tools..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <WarehouseList tools={filteredTools} totalTools={totalTools} onToolSelect={(tool: ToolModel) => {
                            setSelectedTool(tool);
                        }} />
                    </View>
                )}
            </SafeAreaView>
            <ToolDetailModalWarehouse
                visible={!!selectedTool}
                tool={selectedTool}
                onClose={() => setSelectedTool(null)}
            />
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
        marginBottom: 128,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
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
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
});

export default Warehouse;
