// User roles
export enum UserRole {
    ADMIN = 'admin',
    EMPLOYEE = 'employee'
}

// User interface
export interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    avatar?: string;
    createdAt: Date;
}

// Auth response
export interface AuthResponse {
    token: string;
    user: User;
}

// Login credentials
export interface LoginCredentials {
    username: string;
    password: string;
}
