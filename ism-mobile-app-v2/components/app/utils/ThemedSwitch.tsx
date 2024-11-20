import React from 'react';
import { Switch, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ThemedSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const ThemedSwitch: React.FC<ThemedSwitchProps> = ({ value, onValueChange }) => {
    const trackColorFalse = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'background');
    const trackColorTrue = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'background');
    const thumbColorOn = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'icon');
    const thumbColorOff = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'icon');

    return (
        <ThemedView style={styles.switchContainer}>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: trackColorFalse, true: trackColorTrue }}
                thumbColor={value ? thumbColorOn : thumbColorOff}
                ios_backgroundColor={trackColorFalse}
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        padding: 8,
        borderRadius: 4,
    },
});

export default ThemedSwitch;