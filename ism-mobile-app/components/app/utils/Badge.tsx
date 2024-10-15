import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
    text: string;
    isDark?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ text, isDark }) => {
    const theme = isDark !== undefined ? (isDark ? 'dark' : 'light') : useThemeColor({ light: 'light', dark: 'dark' }, 'background');
    const backgroundColor = theme === 'dark' ? Colors.dark.background : 'transparent';
    const borderColor = theme === 'light' ? Colors.light.text : 'transparent';
    const textColor = theme === 'dark' ? Colors.dark.text : Colors.light.text;

    return (
        <ThemedView style={[styles.badge, { backgroundColor, borderColor, borderWidth: theme === 'light' ? 1 : 0 }]}>
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Badge;