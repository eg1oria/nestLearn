export type TaskCreateDto = {
  title: string;
  description: string;
  isCompleted: boolean;
};

export type Task = TaskCreateDto & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

const API_URL = 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const taskApi = {
  create(dto: TaskCreateDto) {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },
  findAll() {
    return request<Task[]>('/tasks', {
      method: 'GET',
    });
  },
  delete(id: string) {
    return request<boolean>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
  findOne(id: string) {
    return request<Task>(`/tasks/${id}`, {
      method: 'GET',
    });
  },
  update(id: string, dto: TaskCreateDto) {
    return request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },
  setIsCompleted(id: string, isCompleted: boolean) {
    return request<boolean>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    });
  },
};
