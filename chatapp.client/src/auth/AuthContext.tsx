import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthResponse, ApiError } from '../types/auth';

interface AuthContextValue {
    user: AuthResponse | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function post(url: string, body: unknown): Promise<AuthResponse> {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = data as ApiError;
        const validation = err.errors
            ? Object.values(err.errors).flat().join(' ')
            : null;
        throw new Error(err.message ?? validation ?? 'Something went wrong.');
    }

    return data as AuthResponse;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthResponse | null>(() => {
        const raw = sessionStorage.getItem('auth');
        return raw ? (JSON.parse(raw) as AuthResponse) : null;
    });

    function save(data: AuthResponse) {
        sessionStorage.setItem('auth', JSON.stringify(data));
        setUser(data);
    }

    async function login(email: string, password: string) {
        save(await post('/api/auth/login', { email, password }));
    }

    async function register(email: string, password: string, fullName: string) {
        save(await post('/api/auth/register', { email, password, fullName }));
    }

    function logout() {
        sessionStorage.removeItem('auth');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
