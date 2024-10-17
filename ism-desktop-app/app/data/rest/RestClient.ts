import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class RestClient {
    private axiosInstance: AxiosInstance;
    private baseUrl: string;

    constructor(baseUrl: string, token?: string) {
        this.baseUrl = baseUrl;
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
                "accessToken": token
            }
        });
    }

    private BuildQueryString(params?: Record<string, any>): string {
        if (!params) return '';
        const queryString = new URLSearchParams(params).toString();
        return queryString ? `?${queryString}` : '';
    }

    public async Get<T>(url: string, params?: Record<string, any>): Promise<T> {
        const queryString = this.BuildQueryString(params);
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.get(`${this.baseUrl}${url}${queryString}`);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to fetch data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Post<T>(url: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.post(`${this.baseUrl}${url}`, data);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to post data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Put<T>(url: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.put(`${this.baseUrl}${url}`, data);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to put data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Patch<T>(url: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.patch(`${this.baseUrl}${url}`, data);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to patch data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Delete(url: string, params?: Record<string, any>): Promise<void> {
        const queryString = this.BuildQueryString(params);
        try {
            await this.axiosInstance.delete(`${this.baseUrl}${url}${queryString}`);
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to delete data: ${err.response?.statusText || err.message}`);
        }
    }
}
