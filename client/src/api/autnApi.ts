import { request } from './apiConfig';
import { Task } from './taskApi';

export type RegisterDto = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  phone: string;
  name?: string;
  tasks?: Task[];
  role: 'USER' | 'ADMIN';
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
  me(token: string) {
    return request<User>(`/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  findAll() {
    return request<User[]>('/auth/admin/users', {
      method: 'GET',
    });
  },
  delete(id: string) {
    return request<boolean>(`/auth/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
