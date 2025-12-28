import axios, { AxiosInstance } from 'axios';

// API base URL - using ADB reverse for USB connection
const API_BASE_URL = 'http://localhost:3000'; // ADB reverse tcp:3000 tcp:3000
// const API_BASE_URL = 'http://10.220.222.11:3000'; // Physical device via hotspot
// const API_BASE_URL = 'http://10.0.2.2:3000'; // Android emulator localhost

class ApiService {
    private instance: AxiosInstance;
    private authToken: string | null = null;

    constructor() {
        this.instance = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.instance.interceptors.request.use(
            config => {
                if (this.authToken) {
                    config.headers.Authorization = `Bearer ${this.authToken}`;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            },
        );

        // Response interceptor for error handling
        this.instance.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    // Token expired or invalid - could dispatch logout here
                    console.log('Unauthorized - token may be expired');
                }
                return Promise.reject(error);
            },
        );
    }

    setAuthToken(token: string | null) {
        this.authToken = token;
    }

    get(url: string, config?: any) {
        return this.instance.get(url, config);
    }

    post(url: string, data?: any, config?: any) {
        return this.instance.post(url, data, config);
    }

    put(url: string, data?: any, config?: any) {
        return this.instance.put(url, data, config);
    }

    delete(url: string, config?: any) {
        return this.instance.delete(url, config);
    }

    patch(url: string, data?: any, config?: any) {
        return this.instance.patch(url, data, config);
    }
}

const api = new ApiService();
export default api;
