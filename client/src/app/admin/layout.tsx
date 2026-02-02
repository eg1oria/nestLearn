'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Loader/Loader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!token) router.replace('/auth');
    else if (user && user.role !== 'ADMIN') router.replace('/');
  }, [isLoading, token, user, router]);

  if (isLoading) return <Loader />;
  if (!token) return null;
  if (!user) return <Loader />;
  if (user.role !== 'ADMIN') return null;

  return <>{children}</>;
}
