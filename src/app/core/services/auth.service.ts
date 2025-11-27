import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, UserRole, AuthResponse, LoginCredentials } from '../../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000';
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(
            storedUser ? JSON.parse(storedUser) : null
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    public get isAdmin(): boolean {
        return this.currentUserValue?.role === UserRole.ADMIN;
    }

    public get isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        // Simulate API call - in production, replace with real API
        return this.http.get<User[]>(`${this.apiUrl}/users?username=${credentials.username}`)
            .pipe(
                map(users => {
                    const user = users.find(u => u.password === credentials.password);
                    if (!user) {
                        throw new Error('Invalid credentials');
                    }
                    const authResponse: AuthResponse = {
                        token: this.generateToken(),
                        user: user
                    };
                    return authResponse;
                }),
                tap(authResponse => {
                    localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
                    localStorage.setItem('token', authResponse.token);
                    this.currentUserSubject.next(authResponse.user);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    register(user: Partial<User>): Observable<User> {
        const newUser: User = {
            id: this.generateId(),
            username: user.username || '',
            email: user.email || '',
            password: user.password || '',
            role: user.role || UserRole.EMPLOYEE,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            createdAt: new Date()
        };
        return this.http.post<User>(`${this.apiUrl}/users`, newUser);
    }

    private generateToken(): string {
        return 'fake-jwt-token-' + Math.random().toString(36).substr(2);
    }

    private generateId(): string {
        return 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}
