'use client';

import { useAuth } from '@/contexts/AuthContext';
import { projectApi, Project } from '@/api/projectApi';
import { taskApi, Task } from '@/api/taskApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaTasks,
  FaProjectDiagram,
  FaCheckCircle,
  FaClock,
  FaHome,
  FaSignOutAlt,
} from 'react-icons/fa';
import Loader from '@/components/Loader/Loader';
import QuoteWidget from '@/components/QuoteWidget/QuoteWidget';

export default function UserPage() {
  const { user, token, isLoading: authLoading, logout, isAuthenticated } = useAuth();
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

  const stats = [
    {
      label: 'Проекты',
      value: projects.length,
      icon: FaProjectDiagram,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Всего задач',
      value: tasks.length,
      icon: FaTasks,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Выполнено',
      value: completedTasks,
      icon: FaCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'В работе',
      value: pendingTasks,
      icon: FaClock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const profileFields = [
    { label: 'Имя', value: user?.name, icon: FaUser },
    { label: 'Email', value: user?.email, icon: FaEnvelope },
    { label: 'Телефон', value: user?.phone || 'Не указан', icon: FaPhone },
    { label: 'ID', value: user?.id?.slice(0, 8) + '...', icon: FaIdCard },
  ];

  // Генерируем инициалы для аватара
  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  // Генерируем случайный градиент для аватара на основе имени
  const gradientColors = [
    'from-blue-400 to-purple-500',
    'from-green-400 to-blue-500',
    'from-purple-400 to-pink-500',
    'from-orange-400 to-red-500',
    'from-teal-400 to-cyan-500',
  ];
  const gradientIndex = user?.name ? user.name.charCodeAt(0) % gradientColors.length : 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm">
            <FaHome />
            Главная
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-95">
            <FaSignOutAlt />
            Выйти
          </button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          {/* Avatar & Name */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
              {/* Avatar */}
              <div className="-mt-16 relative">
                <div
                  className={`flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br ${gradientColors[gradientIndex]} text-4xl font-bold text-white shadow-lg`}>
                  {initials}
                </div>
                <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
              </div>

              {/* Name & Email */}
              <div className="mt-4 text-center sm:mt-0 sm:pb-4 sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Пользователь'}</h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quote of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">💡 Цитата дня</h2>
          <QuoteWidget variant="daily" showRefresh={true} />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="text-gray-400">Загрузка статистики...</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all hover:shadow-md">
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress */}
            {tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Ваш прогресс</h2>
                  <span className="text-sm font-medium text-green-600">
                    {Math.round((completedTasks / tasks.length) * 100)}%
                  </span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {completedTasks} из {tasks.length} задач выполнено
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Информация о профиле</h2>
          <div className="space-y-4">
            {profileFields.map((field) => (
              <div
                key={field.label}
                className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <field.icon className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {field.label}
                  </p>
                  <p className="font-medium text-gray-900">{field.value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/tasks"
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-medium text-white transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200">
            <FaTasks />
            Мои задачи
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200">
            <FaProjectDiagram />
            Мои проекты
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
