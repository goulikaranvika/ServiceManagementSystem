// Update core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7087/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    // Initialize user from token if available
    this.initializeUser();
  }

  private initializeUser(): void {
    if (this.tokenService.hasToken()) {
      const role = this.tokenService.getUserRole();
      if (role) {
        // Set a basic user object with role
        this.currentUserSubject.next({ role: { roleName: role } } as User);
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(tap(response => {
        console.log('Auth Service - Login response:', response);
        this.tokenService.setToken(response.token);
        this.currentUserSubject.next(response.user);
        console.log('Auth Service - User set:', response.user);
      }));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }

  getUserRole(): string {
    const currentUser = this.currentUserSubject.value;
    const userRole = currentUser?.role?.roleName;
    const tokenRole = this.tokenService.getUserRole();
    
    console.log('Auth Service - Current user role:', userRole, 'Token role:', tokenRole);
    return userRole || tokenRole || '';
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}

