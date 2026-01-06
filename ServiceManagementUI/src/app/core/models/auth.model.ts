import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
