import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
    const store = useAuthStore();

    return {
        ...store,
        isAuthenticated: !!store.user,
        role: store.user?.role
    };
};