// lib/services/restaurant.ts

import { buildApiUrl, API_CONFIG } from '../config/api';

const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('restaurant_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const restaurantAdminService = {
    login: async (credentials: any) => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RESTAURANTS.LOGIN), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        return data;
    },

    getSession: async () => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RESTAURANTS.SESSION), {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Not authenticated');
        return await res.json();
    },

    getProfile: async () => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RESTAURANTS.PROFILE), {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.profile;
    },

    updateProfile: async (profileData: any) => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RESTAURANTS.PROFILE), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.profile;
    },

    getProducts: async (page: number = 1, limit: number = 10, search: string = '') => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search ? { search } : {})
        });

        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.RESTAURANTS.PRODUCTS}?${queryParams.toString()}`), {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data; // returns page data {products, total, totalPages, currentPage}
    },

    getProduct: async (id: string | number) => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.RESTAURANTS.PRODUCTS}/${id}`), {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.product;
    },

    createProduct: async (productData: any) => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RESTAURANTS.PRODUCTS), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.product;
    },

    updateProduct: async (id: string | number, productData: any) => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.RESTAURANTS.PRODUCTS}/${id}`), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.product;
    },

    deleteProduct: async (id: string | number) => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.RESTAURANTS.PRODUCTS}/${id}`), {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message);
        }
    },

    getOrders: async (page: number = 1, limit: number = 10, search: string = '', status: string = '') => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search ? { search } : {}),
            ...(status && status !== 'todos' ? { status } : {})
        });

        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.RESTAURANTS.ORDERS}?${queryParams.toString()}`), {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data; // returns page data {orders, total, totalPages, currentPage}
    },
    
    updateOrderStatus: async (id: string | number, status: string) => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.RESTAURANTS.ORDERS}/${id}/status`), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update order status');
        return data.order;
    },

    getStats: async (period: string = 'week') => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.RESTAURANTS.STATS}?period=${period}`), {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.stats;
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        // Fetch requires us to NOT set Content-Type so it can set the boundary automatically for FormData
        const token = localStorage.getItem('restaurant_token');
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD.IMAGE), {
            method: 'POST',
            headers,
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error uploading image');
        return data; // returns { success, url, path }
    }
};
