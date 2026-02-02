import { request } from './apiConfig';

export type SharePermission = 'VIEW' | 'EDIT';

export type TaskDto = {
  title: string;
  description?: string;
  isCompleted?: boolean;
  projectId?: string;
};

export type TaskUpdateDto = {
  title?: string;
  description?: string;
  isCompleted?: boolean;
};

export type TaskShare = {
  id: string;
  taskId: string;
  userId: string;
  permission: SharePermission;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  userId: string;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    title: string;
  } | null;
};

export type SharedTask = Task & {
  permission: SharePermission;
  isShared: true;
  owner: {
    id: string;
    name: string;
    email: string;
  };
};

export const taskApi = {
  create(dto: TaskDto) {
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
  findOne(id: string) {
    return request<Task>(`/tasks/${id}`, {
      method: 'GET',
    });
  },
  update(id: string, dto: TaskUpdateDto) {
    return request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },
  setStatus(id: string, isCompleted: boolean) {
    return request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted }),
    });
  },
  delete(id: string) {
    return request<boolean>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Sharing
  getSharedWithMe() {
    return request<SharedTask[]>('/tasks/shared/with-me', {
      method: 'GET',
    });
  },
  shareTask(id: string, email: string, permission: SharePermission = 'VIEW') {
    return request<TaskShare>(`/tasks/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ email, permission }),
    });
  },
  getTaskShares(id: string) {
    return request<TaskShare[]>(`/tasks/${id}/shares`, {
      method: 'GET',
    });
  },
  updateShare(taskId: string, shareId: string, permission: SharePermission) {
    return request<TaskShare>(`/tasks/${taskId}/shares/${shareId}`, {
      method: 'PATCH',
      body: JSON.stringify({ permission }),
    });
  },
  removeShare(taskId: string, shareId: string) {
    return request<boolean>(`/tasks/${taskId}/shares/${shareId}`, {
      method: 'DELETE',
    });
  },
};
