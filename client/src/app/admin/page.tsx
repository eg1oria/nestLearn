'use client';

import { authApi, type User } from '@/api/autnApi';
import { taskApi } from '@/api/taskApi';
import { useEffect, useState } from 'react';
import styles from './admin.module.scss';
import { useAuth } from '@/contexts/AuthContext';

// Простые SVG иконки для UI
const Icons = {
  Trash: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  User: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Phone: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Search: () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.emptyIconSvg}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  const handleTaskDelete = async (id: string) => {
    try {
      await taskApi.delete(id);
      load();
    } catch (e) {
      console.error(e);
      alert('Ошибка при удалении задачи');
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.id === id) {
      alert('Вы не можете удалить свой собственный аккаунт.');
      return;
    }

    try {
      await authApi.delete(id);
      load();
    } catch (e) {
      console.error(e);
      setError('Не удалось удалить пользователя');
    }
  };

  const load = async () => {
    try {
      setError('');
      const data = await authApi.findAll();
      setUsers(data);
    } catch (e) {
      console.error(e);
      setError('Не удалось загрузить список пользователей');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Администрирование</h1>
          <p className={styles.subtitle}>Управление доступом и задачами команды</p>
        </div>
        <div className={styles.statsBadge}>
          <span>Всего:</span>
          <strong>{users.length}</strong>
        </div>
      </header>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {isLoading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner}></div>
          <p>Загрузка данных...</p>
        </div>
      ) : users.length === 0 ? (
        <div className={styles.emptyState}>
          <Icons.Search />
          <h3>Пользователи не найдены</h3>
          <p>База данных пользователей пуста.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {users.map((userData) => (
            <div key={userData.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.avatarPlaceholder}>
                  {userData.name ? userData.name[0].toUpperCase() : 'U'}
                </div>
                <div className={styles.cardTitle}>
                  <div className={styles.nameRow}>
                    <h3>{userData.name || 'Безымянный'}</h3>
                    <span
                      className={`${styles.roleBadge} ${userData.role === 'ADMIN' ? styles.admin : ''}`}>
                      {userData.role}
                    </span>
                  </div>
                  <span className={styles.userId}>ID: {userData.id.slice(0, 8)}...</span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <Icons.Mail />
                  <span>{userData.email}</span>
                </div>
                {userData.phone && (
                  <div className={styles.infoRow}>
                    <Icons.Phone />
                    <span>{userData.phone}</span>
                  </div>
                )}
              </div>

              <div className={styles.tasksSection}>
                <div className={styles.tasksHeader}>
                  <span>Активные задачи</span>
                  <span className={styles.taskCount}>{userData.tasks?.length || 0}</span>
                </div>

                {userData.tasks && userData.tasks.length > 0 ? (
                  <ul className={styles.taskList}>
                    {userData.tasks.map((task) => (
                      <li key={task.id} className={styles.taskItem}>
                        <span className={styles.taskTitle}>{task.title}</span>
                        <button
                          className={styles.iconButton}
                          onClick={() => handleTaskDelete(task.id)}
                          title="Удалить задачу">
                          <Icons.Trash />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.noTasks}>Нет активных задач</div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.deleteUserButton}
                  onClick={() => handleDelete(userData.id)}
                  disabled={user?.id === userData.id}>
                  <Icons.Trash />
                  <span>Удалить пользователя</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
