import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginModel, LoginResult } from "~/data/models/authentication/AuthenticationModel";
import RestClient from "~/data/rest/RestClient";
import { ApiResponse } from "~/data/models/generic/ApiModel";

const LoginScreen = () => {
    const API_BASE_URL = "https://a04e-158-62-42-150.ngrok-free.app/api";
    const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk1MjAxOTEsImV4cCI6MTczMjExMjE5MX0.ke2Xab98m43_0v5zbY00shpVoNcB3UrMBXItA1AQDiQ";

    const restClient = new RestClient(API_BASE_URL, API_TOKEN);

    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        const loginModel: LoginModel = { email, password };

        try {
            const response: ApiResponse<LoginResult> = await restClient.Post("/auth/login", { payload: loginModel });
            if (response.status === "success") {
                await AsyncStorage.setItem('userToken', response.data?.accessToken || '');
                navigation.navigate("(tabs)");
            } else {
                setError(response?.data?.message || "Login failed");
            }
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.showPasswordText}>
                        {showPassword ? "Hide" : "Show"} Password
                    </Text>
                </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: "#333",
        marginBottom: 4,
    },
    input: {
        width: "100%",
        padding: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        backgroundColor: "#fff",
    },
    showPasswordText: {
        marginTop: 4,
        color: "#007BFF",
        textAlign: "right",
    },
    errorText: {
        color: "red",
        marginBottom: 16,
    },
    button: {
        width: "100%",
        padding: 12,
        backgroundColor: "#000000",
        borderRadius: 4,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default LoginScreen;
