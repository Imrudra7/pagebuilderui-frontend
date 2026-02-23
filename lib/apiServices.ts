// @/lib/apiService.ts
import { 
  LoginRequest, LoginResponse, 
  RegisterRequest, RegisterResponse, 
  LogoutRequest, AuthTokens 
} from '@/types/auth';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;


async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${SERVER_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // 🔥 HttpOnly Cookies ke liye zaroori
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  // Logout jaisa endpoint agar empty response de toh null handle karein
  if (response.status === 204) return {} as T;

  return response.json();
}

export const authAPI = {
  // Login Call
  login: (data: LoginRequest, path:string) => 
    request<LoginResponse>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Register Call
  register: (data: RegisterRequest, path:string) => 
    request<RegisterResponse>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Logout Call (Body + Authorization Header)
  logout: (data: LogoutRequest, accessToken: string, path: string) => 
    request<string>(path, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` },
      body: JSON.stringify(data),
    }),

  // Refresh Token Call
  refresh: (refreshToken: string, path: string) => 
    request<AuthTokens>(path, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  // Secure API Check
  checkSecure: (path: string) => 
    request<string>(path, { method: 'GET' }),
};