import { 
    CreateTodoInput, 
    UpdateTodoInput, 
    TodoSchema, 
    TodoSearchInput 
} from "@/data/models/TodoModel";

interface ITodoService {
    GetAllTodos(options?: Record<string, unknown>): Promise<TodoSchema[]>;
    GetPagedTodos({page, limit, search}: TodoSearchInput): Promise<any>;
    GetTodo(id: number): Promise<TodoSchema | null>;
    CreateTodo(todo: CreateTodoInput): Promise<TodoSchema>;
    UpdateTodo(id: number, todo: UpdateTodoInput): Promise<TodoSchema>;
    DeleteTodo(id: number): Promise<void>;
}

export default ITodoService;