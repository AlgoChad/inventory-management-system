import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TodoService from "@/core/services/todos/TodoService";
import { FormatShortDate, FormatShortTime, TruncateTodoTitle } from "@/core/utils/HelperFunctions";
import { TodoSchema } from "@/data/models/TodoModels";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Badge from "../utils/Badge";
import ThemedSwitch from "../utils/ThemedSwitch";

const todoService = TodoService.GetInstance();

export default function TodoItem({ index, todo }: { index: any, todo: TodoSchema }) {
    const [isChecked, setIsChecked] = useState(todo.completed);
    
    useEffect(() => {
        setIsChecked(todo.completed);
    }, [todo]);

    const toggleTodoStatus = async (todo: TodoSchema) => {
        setIsChecked(todo.completed);
        await todoService.ToggleTodoStatus(todo.id, !todo.completed);
    }

    return (
        <ThemedView key={index} style={style.card}>
            <ThemedView style={style.header}>
                <ThemedText style={style.title}>{TruncateTodoTitle(todo.title)}</ThemedText>
                <ThemedView style={style.dateTimeContainer}>
                    <ThemedText style={style.date}>
                        {`${FormatShortDate(todo.updatedAt)} ${FormatShortTime(todo.updatedAt)}`}
                    </ThemedText>
                </ThemedView>
            </ThemedView>
            <ThemedView style={style.body}>
                <Badge text={isChecked ? 'Completed' : 'Incomplete'} isDark={isChecked} />
                <ThemedSwitch
                    value={isChecked}
                    onValueChange={() => toggleTodoStatus(todo)}
                />
            </ThemedView>
        </ThemedView>
    );
}

const style = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        margin: 5,
    }, 
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateTimeContainer: {
        alignItems: 'flex-end',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    completed: {
        backgroundColor: 'green',
    },
    incomplete: {
        backgroundColor: 'red',
    },
    badgeThemedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});