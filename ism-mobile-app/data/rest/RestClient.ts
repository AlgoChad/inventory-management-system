import axios, { AxiosInstance, AxiosResponse } from 'axios';

export default class RestClient {
    private axiosInstance: AxiosInstance;

    constructor(baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json'
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
            const response: AxiosResponse<T> = await this.axiosInstance.get(`${url}${queryString}`);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to fetch data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Post<T>(url: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.post(url, data);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to post data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Put<T>(url: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.put(url, data);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to put data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Patch<T>(url: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data);
            return response.data;
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to patch data: ${err.response?.statusText || err.message}`);
        }
    }

    public async Delete(url: string, params?: Record<string, any>): Promise<void> {
        const queryString = this.BuildQueryString(params);
        try {
            await this.axiosInstance.delete(`${url}${queryString}`);
        } catch (error) {
            const err = error as any;
            throw new Error(`Failed to delete data: ${err.response?.statusText || err.message}`);
        }
    }
}