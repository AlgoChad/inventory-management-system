import { z } from "zod";
import TodoRepository from "@/data/repository/TodoRepository"
import {
    BaseTodoSchema,
    CreateTodoInput,
    UpdateTodoInput,
    TodoSchema,
    TodoSearchInput
} from '@/data/models/TodoModel';
import ITodoService from './ITodoService';
import { PrismaClient } from "@prisma/client/extension";
import WebSocketResolver from "@/core/utils/resolvers/WebSocketResolver";

class TodoService implements ITodoService {
    private static instance: TodoService;
    private Repository: typeof TodoRepository;
    private SocketResolver: typeof WebSocketResolver.prototype;

    constructor() {
        this.Repository = TodoRepository;
        this.SocketResolver = new WebSocketResolver('ws://192.168.254.104:8080');
    }

    public static GetInstance(): TodoService {
        if (!TodoService.instance) {
            TodoService.instance = new TodoService();
        }
        return TodoService.instance;
    }

    async GetAllTodos(options?: Record<string, unknown>): Promise<TodoSchema[]> {
        const todos = await this.Repository.GetAllAsync(async (query: PrismaClient) => {
            const result = await query.findMany({
                orderBy: {
                    id: 'desc'
                },
            });

            return result;
        });

        return todos ?? [];
    }

    async GetPagedTodos(
        { page, limit, search }: TodoSearchInput
    ): Promise<any> {
        const todos = await this.Repository.GetAllPagedAsync(async (query: PrismaClient) => {
            const result = await query.findMany({
                orderBy: {
                    id: 'desc'
                },
                where: {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            });
    
            return result;
        }, page, limit, true, { page, limit, search }); 
    
        return todos;
    }

    async GetTodo(id: number): Promise<TodoSchema | null> {
        const todo = await this.Repository.GetByIdAsync(id);
        return todo ?? null;
    }

    async CreateTodo(todo: CreateTodoInput): Promise<TodoSchema> {
        try {
            const createData = {
                id: 0,
                title: todo.title,
                description: todo.description,
                completed: todo.completed ?? false,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const createdTodo = await this.Repository.InsertAsync(createData);
            if (!createdTodo) {
                throw new Error('Failed to create todo');
            }

            this.SocketResolver.Publish('Todo', { actionType: 'createdTodo', id: createdTodo.id})

            return createdTodo;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }

    async UpdateTodo(id: number, todo: UpdateTodoInput): Promise<TodoSchema> {
        try {
            const existingTodo = await this.Repository.GetByIdAsync(id);
            if (!existingTodo) {
                throw new Error('Todo not found');
            }
    
            const updatedData = {
                id: existingTodo.id,
                title: todo.title ?? existingTodo.title,
                description: todo.description ?? existingTodo.description,
                completed: todo.completed ?? existingTodo.completed,
                createdAt: existingTodo.createdAt,
                updatedAt: new Date()
            };
    
            const parsedData = BaseTodoSchema.parse(updatedData);
            const updatedTodo = await this.Repository.UpdateAsync(parsedData);
            if (!updatedTodo) {
                throw new Error('Failed to update todo');
            }

            this.SocketResolver.Publish('Todo', { actionType: 'updatedTodo', id: updatedTodo.id})

            return updatedTodo;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
            }
            throw error;
        }
    }

    async DeleteTodo(id: number): Promise<void> {
        const existingTodo = await this.Repository.GetByIdAsync(id);
        if (!existingTodo) {
            throw new Error('Todo not found');
        }
        const result = await this.Repository.DeleteAsync(existingTodo);
        if (!result) {
            throw new Error('Failed to delete todo');
        }

        this.SocketResolver.Publish('Todo', { actionType: 'deletedTodo', id })
    }
}

export default TodoService;