import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { AntDesign, FontAwesome, MaterialIcons, Ionicons, Entypo } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

const lighterShade = "#4a7a9b"; // Lighter shade of #2f5f7c
const buttonColor = "#fca923"; // Color for the buttons in the nav bar

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ffffff",
                tabBarInactiveTintColor: "#000000",
                tabBarStyle: {
                    backgroundColor: lighterShade,
                    height: 80,
                    position: "absolute",
                    bottom: 25,
                    left: 25,
                    right: 25,
                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 6,
                },
                tabBarShowLabel: false,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconContainerFocused,
                            ]}
                        >
                            <AntDesign name="home" size={24} color={focused ? "#ffffff" : "#000000"} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="projects"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconContainerFocused,
                            ]}
                        >
                            <FontAwesome name="folder-open" size={24} color={focused ? "#ffffff" : "#000000"} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="warehouse"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconContainerFocused,
                            ]}
                        >
                            <Entypo name="shop" size={24} color={focused ? "#ffffff" : "#000000"} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="tool-request"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconContainerFocused,
                            ]}
                        >
                            <AntDesign name="tool" size={24} color="black" />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="tool-repair"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconContainerFocused,
                            ]}
                        >
                            <MaterialIcons name="build" size={24} color={focused ? "#ffffff" : "#000000"} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    iconContainerFocused: {
        backgroundColor: buttonColor,
    },
});
