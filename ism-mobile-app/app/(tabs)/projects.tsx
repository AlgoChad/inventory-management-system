import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, SafeAreaView, Text, TextInput } from "react-native";
import CheckinService from "@/core/services/CheckinService";
import { CheckinModel } from "@/data/models/checkin/CheckinModel";
import ProjectList from "~/components/home/ProjectList";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const Projects = () => {
    const [checkins, setCheckins] = useState<CheckinModel[]>([]);
    const [filteredCheckins, setFilteredCheckins] = useState<CheckinModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredCheckins(checkins);
        } else {
            setFilteredCheckins(
                checkins.filter((checkin) =>
                    checkin.project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, checkins]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const checkinsResponse = await CheckinService.getAllCheckins();

            if (checkinsResponse.data) {
                setCheckins(checkinsResponse.data);
                setFilteredCheckins(checkinsResponse.data);
            } else {
                throw new Error("Failed to load data");
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupedTools = filteredCheckins.reduce((acc: { [key: string]: CheckinModel[] }, checkin) => {
        const projectId = checkin.projectId.toString();
        if (!acc[projectId]) {
            acc[projectId] = [];
        }
        acc[projectId].push(checkin);
        return acc;
    }, {});

    return (
        <ParallaxScrollView
            headerImage={<View style={styles.parallaxHeader}><Text style={styles.parallaxHeaderText}>Projects</Text></View>}
            headerBackgroundColor={{ dark: "#2f5f7c", light: "#2f5f7c" }}
        >
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={styles.content}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <ProjectList groupedTools={groupedTools} />
                    </View>
                )}
            </SafeAreaView>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 8,
        marginBottom: 75,
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

export default Projects;
