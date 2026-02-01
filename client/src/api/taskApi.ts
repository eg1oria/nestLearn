import { request, Utils } from './apiConfig';

export type TaskCreateDto = {
  title: string;
  description: string;
  isCompleted: boolean;
};

export type Task = TaskCreateDto & Utils;

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
