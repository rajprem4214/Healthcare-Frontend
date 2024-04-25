'use client';

import { authStore } from '@/store/auth/Auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

export default function RouteGuard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const userStore = useSnapshot(authStore);

  useEffect(() => {
    if (!userStore.isAuthenticated) {
      router.push('/auth/login', { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
