import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useSharedValue,
    useAnimatedScrollHandler,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
    children,
    headerImage,
    headerBackgroundColor,
}: Props) {
    const colorScheme = useColorScheme() ?? "light";
    const scrollOffset = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [2, 1, 1]
                    ),
                },
            ],
        };
    });

    return (
        <ThemedView style={styles.container}>
            <Animated.FlatList
                ref={useAnimatedRef<Animated.FlatList<any>>()}
                data={[{ key: "content", content: children }]}
                renderItem={({ item }) => <View>{item.content}</View>}
                keyExtractor={(item) => item.key}
                scrollEventThrottle={16}
                ListHeaderComponent={
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                backgroundColor:
                                    headerBackgroundColor[colorScheme],
                            },
                            headerAnimatedStyle,
                        ]}
                    >
                        {headerImage}
                    </Animated.View>
                }
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: HEADER_HEIGHT,
        overflow: "hidden",
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: "hidden",
    },
});
