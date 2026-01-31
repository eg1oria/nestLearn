'use client';

import { Task, taskApi, TaskCreateDto } from '@/api/taskApi';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function Home() {
  const [form, setForm] = useState<TaskCreateDto>({
    title: '',
    description: '',
    isCompleted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  async function onShowModal(id: string) {
    try {
      const task = await taskApi.findOne(id);
      setEditingTask(task);
      setShowModal(true);
    } catch (e: unknown) {
      setError('Не удалось открыть задачу');
    }
  }

  const loadTasks = async () => {
    try {
      const data = await taskApi.findAll();
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setTasks(sorted);
    } catch (e: unknown) {
      console.error(e);
    }
  };

  async function onDelete(id: string) {
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await taskApi.delete(id);
    } catch (error) {
      setError('Ошибка удаления');
      loadTasks();
    }
  }

  async function onUpdate() {
    if (!editingTask) return;
    setLoading(true);
    try {
      const updatedTask = await taskApi.update(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        isCompleted: editingTask.isCompleted,
      });

      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      setShowModal(false);
      setEditingTask(null);
      loadTasks();
    } catch (e: unknown) {
      setError('Ошибка обновления');
    } finally {
      setLoading(false);
    }
  }

  async function setIsComplete(id: string, isCompleted: boolean) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted } : t)));

    try {
      const currentTask = tasks.find((t) => t.id === id);
      if (!currentTask) return;

      await taskApi.setIsCompleted(id, isCompleted);
    } catch (e) {
      setError('Ошибка обновления статуса');
      loadTasks();
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function onCreate() {
    if (!form.title.trim()) return;
    setLoading(true);
    setError('');

    try {
      const newTask = await taskApi.create(form);
      setForm({ title: '', description: '', isCompleted: false });

      setTasks((prev) => [newTask, ...prev]);
    } catch (e: unknown) {
      setError('Ошибка создания задачи');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 font-sans selection:bg-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 md:py-20">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">Задачи</h1>
        </div>

        <div className="mb-12 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl shadow-gray-200/50">
          <div className="flex flex-col gap-2 p-4">
            <input
              type="text"
              placeholder="Что нужно сделать?"
              className="w-full bg-transparent text-lg font-medium placeholder:text-gray-400 focus:outline-none"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Добавьте детали (необязательно)"
              className="w-full bg-transparent text-sm text-gray-600 placeholder:text-gray-300 focus:outline-none"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />

            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <input
                  type="checkbox"
                  className="accent-black h-4 w-4 rounded border-gray-300"
                  checked={form.isCompleted}
                  onChange={(e) => setForm((p) => ({ ...p, isCompleted: e.target.checked }))}
                />
                <span>Сразу выполнено</span>
              </label>

              <button
                onClick={onCreate}
                disabled={loading || !form.title.trim()}
                className="flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
                Создать
              </button>
            </div>
          </div>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        <div className="space-y-4">
          {tasks.length === 0 && !loading && (
            <div className="py-10 text-center text-gray-400 text-sm">Список задач пуст.</div>
          )}

          <ul className="flex flex-col gap-3 relative">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.li
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  key={task.id}
                  className="group relative flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 transition-colors hover:border-gray-300 hover:shadow-sm">
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setIsComplete(task.id, !task.isCompleted)}
                    className={`mt-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${task.isCompleted ? 'bg-green-100 border-green-200 text-green-600' : 'border-gray-300 text-transparent hover:border-gray-400'}`}>
                    {task.isCompleted && <FaCheck />}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-gray-900 truncate transition-all duration-300 ${task.isCompleted ? 'text-gray-400 line-through' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                    )}
                  </div>

                  <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onShowModal(task.id)}
                      className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                      title="Редактировать">
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Удалить">
                      <FaRegTrashAlt />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {showModal && editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Редактирование</h2>
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
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask((prev) => (prev ? { ...prev, title: e.target.value } : null))
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
                    value={editingTask.description}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev ? { ...prev, description: e.target.value } : null,
                      )
                    }
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-black rounded border-gray-300"
                    checked={editingTask.isCompleted}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev ? { ...prev, isCompleted: e.target.checked } : null,
                      )
                    }
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Отметить как выполненное
                  </span>
                </label>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex gap-3">
                <button
                  onClick={onUpdate}
                  disabled={loading || !editingTask.title.trim()}
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
