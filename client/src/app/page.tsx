'use client';

import { useAuth } from '@/contexts/AuthContext';
import { projectApi, Project } from '@/api/projectApi';
import { taskApi, Task } from '@/api/taskApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaTasks, FaProjectDiagram, FaCheckCircle, FaClock, FaPlus } from 'react-icons/fa';
import Loader from '@/components/Loader/Loader';

export default function DashboardPage() {
  const { token, isLoading: authLoading, user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsData, tasksData] = await Promise.all([
        projectApi.findAll(),
        taskApi.findAll(),
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !token && !user) {
      router.replace('/auth');
    }
  }, [authLoading, token, router, user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  if (authLoading) return <Loader />;
  if (!token) return null;

  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = tasks.filter((t) => !t.isCompleted).length;
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Всего проектов',
      value: projects.length,
      icon: FaProjectDiagram,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Всего задач',
      value: tasks.length,
      icon: FaTasks,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Выполнено',
      value: completedTasks,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'В работе',
      value: pendingTasks,
      icon: FaClock,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold tracking-tight text-gray-900">
              Добро пожаловать, {user?.name || 'Пользователь'}! 👋
            </motion.h1>
            <p className="mt-2 text-gray-500">Вот обзор ваших проектов и задач</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/tasks"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm">
              Задачи
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm">
              Проекты
            </Link>
            <Link
              href="/user"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm">
              Профиль
            </Link>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-95">
              Выйти
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-gray-400">Загрузка данных...</div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl ${stat.lightColor} p-3`}>
                      <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress */}
            {tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Прогресс выполнения</h2>
                <div className="relative h-4 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {completedTasks} из {tasks.length} задач выполнено (
                  {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%)
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Tasks */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Последние задачи</h2>
                  <Link
                    href="/tasks"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                    <FaPlus className="h-3 w-3" />
                    Добавить
                  </Link>
                </div>
                {recentTasks.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">Нет задач</p>
                ) : (
                  <ul className="space-y-3">
                    {recentTasks.map((task) => (
                      <li key={task.id}>
                        <Link
                          href={`/tasks/${task.id}`}
                          className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              task.isCompleted ? 'bg-green-500' : 'bg-orange-400'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`truncate font-medium ${
                                task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
                              }`}>
                              {task.title}
                            </p>
                            {task.project && (
                              <p className="text-xs text-gray-400">{task.project.title}</p>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>

              {/* Projects */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Ваши проекты</h2>
                  <Link
                    href="/projects"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                    <FaPlus className="h-3 w-3" />
                    Добавить
                  </Link>
                </div>
                {projects.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">Нет проектов</p>
                ) : (
                  <ul className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <li key={project.id}>
                        <Link
                          href={`/projects/${project.id}`}
                          className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50">
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">{project.title}</p>
                            {project.description && (
                              <p className="truncate text-xs text-gray-400">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 flex items-center gap-2 text-xs text-gray-400">
                            <FaTasks />
                            <span>{project.tasks?.length || 0}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/projects"
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
                <FaProjectDiagram className="transition-transform group-hover:scale-110" />
                Создать проект
              </Link>
              <Link
                href="/tasks"
                className="group flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-medium text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200">
                <FaTasks className="transition-transform group-hover:scale-110" />
                Создать задачу
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
