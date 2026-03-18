import { buildApiUrl, API_CONFIG } from '../config/api';

const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('auth_token'); // Usa el token normal del comprador (adminMiddleware verifica)
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const superAdminService = {
    getStats: async (period: string = 'week') => {
        const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.STATS)}?periodo=${period}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error fetching global stats');
        return data;
    },

    getRestaurants: async () => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.RESTAURANTS_LIST), {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error fetching restaurants');
        return data.restaurants;
    },

    getRestaurantProfile: async (id: number | string) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.RESTAURANT_PROFILE).replace(':id', id.toString());
        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error fetching restaurant profile');
        return data.profile;
    },

    createRestaurant: async (restaurantData: any) => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.RESTAURANTS_CREATE), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(restaurantData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error creating restaurant');
        return data.restaurant;
    },

    deleteRestaurant: async (id: number | string) => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.RESTAURANTS_LIST}/${id}`), {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Error deleting restaurant');
        return data;
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('auth_token');
        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // El endpoint es común, pero el middleware de autenticación valida ambos tokens
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD.IMAGE), {
            method: 'POST',
            headers,
            body: formData
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error uploading image');
        return data;
    },

    createCredentials: async (credentialsData: any) => {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SUPER_ADMIN.CREDENTIALS_CREATE), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(credentialsData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Error creating credentials');
        return data.user;
    },

    updateCredentials: async (id: number | string, updateData: any) => {
        const res = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.SUPER_ADMIN.CREDENTIALS_UPDATE}/${id}`), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updateData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Error updating credentials');
        return data.user;
    },

    // --- User Management ---
    getAllUsers: async () => {
        const res = await fetch(`${buildApiUrl('/super-admin/users')}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error fetching users');
        return data.users;
    },

    toggleUserBlock: async (id: number | string, action: 'block' | 'unblock', reason?: string) => {
        const res = await fetch(`${buildApiUrl(`/super-admin/users/${id}/block`)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ action, reason })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error toggling user status');
        return data.user;
    },

    // --- Coupon Management ---
    getAllCoupons: async () => {
        const res = await fetch(`${buildApiUrl('/super-admin/coupons')}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error fetching coupons');
        return data.coupons;
    },

    createCoupon: async (couponData: any) => {
        const res = await fetch(`${buildApiUrl('/super-admin/coupons')}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(couponData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Error creating coupon');
        return data.coupon;
    },

    toggleCouponStatus: async (id: number | string, activo: boolean) => {
        const res = await fetch(`${buildApiUrl(`/super-admin/coupons/${id}/toggle`)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ activo })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error toggling coupon status');
        return data.coupon;
    },

    deleteCoupon: async (id: number | string) => {
        const res = await fetch(`${buildApiUrl(`/super-admin/coupons/${id}`)}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error deleting coupon');
        return data.message;
    },

    // --- Global Orders Management ---
    getGlobalOrders: async (page: number = 1, limit: number = 10, search: string = '', status: string = '', restauranteId: string = '') => {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search ? { search } : {}),
            ...(status && status !== 'todos' ? { status } : {}),
            ...(restauranteId && restauranteId !== 'todos' ? { restauranteId } : {})
        });

        // The endpoint is mounted at /api/v1/admin/orders usually, matching `buildApiUrl` configuration used for super-admin routes.
        // If buildApiUrl('/super-admin/orders') resolves to /api/v1/super-admin/orders, we use that.
        const res = await fetch(`${buildApiUrl('/super-admin/orders')}?${queryParams.toString()}`, {
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error fetching global orders');
        return data; // returns page data {orders, total, totalPages, currentPage}
    },

    updateOrderStatus: async (id: string | number, status: string) => {
        const res = await fetch(`${buildApiUrl(`/super-admin/orders/${id}/status`)}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error updating order status');
        return data.order;
    }
};
