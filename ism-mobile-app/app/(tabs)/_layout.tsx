import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#000000",
                tabBarInactiveTintColor: "#000000",
                tabBarStyle: {
                    backgroundColor: Colors["light"].background,
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
                            <TabBarIcon
                                name={focused ? "home" : "home-outline"}
                                color="#000000"
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            style={[
                                styles.iconContainer,
                                focused && styles.iconContainerFocused,
                            ]}
                        >
                            <TabBarIcon
                                name={focused ? "settings" : "settings-outline"}
                                color="#000000"
                            />
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
        backgroundColor: "#e0e0e0",
    },
});
