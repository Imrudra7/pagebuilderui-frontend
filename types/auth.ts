export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  status: string;
  roles: string[];
  message: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName: string;
  termsAccepted: boolean;
  phone?: string;
}

export interface RegisterResponse {
  userId: string; // UUID string format mein aayega
  email: string;
  fullName: string;
  roles: string[];
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}