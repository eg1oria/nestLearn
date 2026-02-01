import { request } from './apiConfig';

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
};

type TokenResponse = {
  accessToken: string;
};

export const authApi = {
  register(dto: RegisterDto) {
    return request<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },
  login(dto: LoginDto) {
    return request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },
  logout() {
    return request<boolean>(`/auth/logout`, {
      method: 'POST',
    });
  },
  refresh() {
    return request<TokenResponse>('/auth/refresh', {
      method: 'POST',
    });
  },
  me() {
    return request<User>(`/auth/me`, {
      method: 'GET',
    });
  },
};
