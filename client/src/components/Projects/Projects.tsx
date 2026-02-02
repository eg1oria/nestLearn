'use client';

import { Project, projectApi, ProjectDto, SharedProject } from '@/api/projectApi';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaRegTrashAlt, FaUserFriends } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const [form, setForm] = useState<ProjectDto>({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const [ownProjects, shared] = await Promise.all([
        projectApi.findAll(),
        projectApi.getSharedWithMe(),
      ]);
      setProjects(ownProjects);
      setSharedProjects(shared);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Ошибка при загрузке проектов');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) {
      setError('Название обязательно');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const newProject = await projectApi.create(form);
      setForm({ title: '', description: '' });
      setProjects((prev) => [newProject, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Ошибка при создании проекта');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await projectApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Ошибка при удалении проекта');
    } finally {
      setLoading(false);
    }
  };

  const onShowModal = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const onUpdate = async () => {
    if (!editingProject) return;
    setLoading(true);
    try {
      const updatedProject = await projectApi.update(editingProject.id, {
        title: editingProject.title,
        description: editingProject.description,
      });

      setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
      setShowModal(false);
      setEditingProject(null);
    } catch {
      setError('Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  const navigateToProject = (id: string) => {
    router.push(`/projects/${id}`);
  };

  useEffect(() => {
    // Ждём пока загрузится состояние авторизации
    if (authLoading) return;

    // Если не авторизован — редирект на страницу входа
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    loadProjects();
  }, [authLoading, isAuthenticated, router, loadProjects]);

  // Показываем загрузку пока проверяем авторизацию
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Проверка авторизации...</div>
      </div>
    );
  }

  // Если не авторизован — ничего не показываем (будет редирект)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans selection:bg-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">Проекты</h1>
            <p className="text-gray-500 text-sm">Управляйте вашими проектами</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/tasks"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
              Задачи
            </Link>
            <Link
              href="/user"
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50">
              Профиль
            </Link>
            <button
              onClick={logout}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-95">
              Выйти
            </button>
          </div>
        </div>

        <div className="mb-12 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl shadow-gray-200/50">
          <div className="flex flex-col gap-2 p-4">
            <input
              type="text"
              placeholder="Название проекта"
              className="w-full bg-transparent text-lg font-medium placeholder:text-gray-400 focus:outline-none"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Описание проекта (необязательно)"
              className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-300 focus:outline-none"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              disabled={loading}
            />

            <div className="mt-4 flex items-center justify-end border-t border-gray-50 pt-4">
              <button
                onClick={handleCreate}
                disabled={loading || !form.title.trim()}
                className="flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
                {loading ? 'Создание...' : 'Создать проект'}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="space-y-4">
          {projects.length === 0 && !loading && (
            <div className="py-10 text-center text-gray-400 text-sm">
              Нет проектов. Создайте первый!
            </div>
          )}

          <ul className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <motion.li
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  key={project.id}
                  className="group relative rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md cursor-pointer"
                  onClick={() => navigateToProject(project.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                      )}
                      {project.tasks && (
                        <div className="mt-3 text-xs text-gray-400">
                          {project.tasks.length} {project.tasks.length === 1 ? 'задача' : 'задач'}
                        </div>
                      )}
                    </div>

                    <div
                      className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onShowModal(project)}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                        title="Редактировать">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Удалить">
                        <FaRegTrashAlt />
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        {/* Shared Projects Section */}
        {sharedProjects.length > 0 && (
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FaUserFriends className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Доступные мне проекты</h2>
            </div>
            <ul className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {sharedProjects.map((project) => (
                  <motion.li
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    key={project.id}
                    className="group relative rounded-xl border border-blue-100 bg-blue-50/30 p-5 transition-all hover:border-blue-300 hover:shadow-md cursor-pointer"
                    onClick={() => router.push(`/projects/${project.id}?shared=true`)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900 truncate">
                            {project.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              project.permission === 'EDIT'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                            {project.permission === 'EDIT' ? 'Редактирование' : 'Просмотр'}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                          <span>От: {project.owner.name}</span>
                          {project.tasks && <span>• {project.tasks.length} задач</span>}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Редактирование проекта</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600">
                  <IoMdClose />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                    Название
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject((prev) =>
                        prev ? { ...prev, title: e.target.value } : null,
                      )
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                    Описание
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all resize-none"
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject((prev) =>
                        prev ? { ...prev, description: e.target.value } : null,
                      )
                    }
                  />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex gap-3">
                <button
                  onClick={onUpdate}
                  disabled={loading || !editingProject.title.trim()}
                  className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50 transition-all">
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
