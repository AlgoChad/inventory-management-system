import React from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const HomeScreen = () => {
    const navigation = useNavigation();

    const navigateToScreen = (screen: string) => {
        navigation.navigate(screen as never);
    };

    return (
        <ParallaxScrollView
            headerImage={<View style={styles.parallaxHeader}><Text style={styles.parallaxHeaderText}>Home</Text></View>}
            headerBackgroundColor={{ dark: "#2f5f7c", light: "#2f5f7c" }}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.buttonContainer}>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateToScreen("projects")}
                        >
                            <Text style={styles.buttonText}>Projects</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateToScreen("warehouse")}
                        >
                            <Text style={styles.buttonText}>Warehouse</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateToScreen("tool-request")}
                        >
                            <Text style={styles.buttonText}>Tool Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateToScreen("tool-repair")}
                        >
                            <Text style={styles.buttonText}>Tool Repair</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f8f8",
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
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#4a7a9b",
        padding: 20,
        borderRadius: 10,
        width: "45%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default HomeScreen;
