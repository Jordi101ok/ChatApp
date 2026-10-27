export interface AuthResponse {
    token: string;
    email: string;
    fullName: string;
}

export interface ApiError {
    message?: string;
    title?: string;
    errors?: Record<string, string[]>;
}
