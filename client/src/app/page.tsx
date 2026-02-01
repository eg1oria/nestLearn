'use client';

import { useAuth } from '@/contexts/AuthContext';
import TasksPage from '../components/tasks/TasksPage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader/Loader';

export default function Home() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/auth');
    }
  }, [isLoading, token, router]);

  if (isLoading) return <Loader />;
  if (!token) return null;

  return <TasksPage />;
}
