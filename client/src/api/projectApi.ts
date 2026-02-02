import { request, Utils } from './apiConfig';
import { Task } from './taskApi';

export type ProjectDto = {
  title: string;
  description: string;
  tasks?: Task[];
};

export type SharePermission = 'VIEW' | 'EDIT';

export type ProjectShare = {
  id: string;
  projectId: string;
  userId: string;
  permission: SharePermission;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type SharedProject = ProjectDto &
  Utils & {
    permission: SharePermission;
    isShared: true;
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };

export type Project = ProjectDto & Utils;

export const projectApi = {
  create(dto: ProjectDto) {
    return request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },
  findAll() {
    return request<Project[]>('/projects', {
      method: 'GET',
    });
  },
  findOne(id: string) {
    return request<Project>(`/projects/${id}`, {
      method: 'GET',
    });
  },
  update(id: string, dto: Partial<ProjectDto>) {
    return request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },
  delete(id: string) {
    return request<boolean>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Sharing
  getSharedWithMe() {
    return request<SharedProject[]>('/projects/shared/with-me', {
      method: 'GET',
    });
  },
  getSharedProject(id: string) {
    return request<SharedProject>(`/projects/shared/${id}`, {
      method: 'GET',
    });
  },
  shareProject(id: string, email: string, permission: SharePermission = 'VIEW') {
    return request<ProjectShare>(`/projects/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ email, permission }),
    });
  },
  getProjectShares(id: string) {
    return request<ProjectShare[]>(`/projects/${id}/shares`, {
      method: 'GET',
    });
  },
  updateShare(projectId: string, shareId: string, permission: SharePermission) {
    return request<ProjectShare>(`/projects/${projectId}/shares/${shareId}`, {
      method: 'PATCH',
      body: JSON.stringify({ permission }),
    });
  },
  removeShare(projectId: string, shareId: string) {
    return request<boolean>(`/projects/${projectId}/shares/${shareId}`, {
      method: 'DELETE',
    });
  },
};
