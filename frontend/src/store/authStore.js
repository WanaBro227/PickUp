import { create } from 'zustand';
import axios from 'axios';

// ✅ BASE API
const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// ✅ Attach JWT automatically
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,

    // ================= REGISTER =================
    register: async (userData) => {
        set({ loading: true });

        try {
            const res = await API.post('/auth/register', userData);

            set({ user: res.data, loading: false });
            localStorage.setItem('user', JSON.stringify(res.data));

            return { success: true };

        } catch (err) {
            set({ loading: false });

            return {
                success: false,
                error: err.response?.data || 'Registration failed'
            };
        }
    },

    // ================= LOGIN =================
    login: async (email, password) => {
        set({ loading: true });

        try {
            const res = await API.post('/auth/login', { email, password });

            const { user, token } = res.data;

            const userData = { ...user, token };

            set({ user: userData, loading: false });
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true };

        } catch (err) {
            set({
                loading: false,
                error: err.response?.data || 'Login failed'
            });

            return { success: false };
        }
    },

    // ================= LOGOUT =================
    logout: () => {
        set({ user: null });
        localStorage.removeItem('user');
    },

    // ================= SELLER REQUEST =================
    requestSellerAccess: async (payload) => {
        const { user } = useAuthStore.getState();

        try {
            const res = await API.put(
                `/user/${user.id}/become-seller`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );

            console.log("Response:", res.data);

            const updatedUser = { ...user, ...res.data };

            set({ user: updatedUser });
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return { success: true };

        } catch (err) {
            console.error("Seller request error:", err);
            console.error("Response:", err.response);

            return {
                success: false,
                error: err.response?.data || 'Seller request failed'
            };
        }
    }
}));