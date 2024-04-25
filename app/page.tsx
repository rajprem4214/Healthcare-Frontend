'use client';
import { authStore } from '@/store/auth/Auth';
import { Metadata } from 'next';
import Image from 'next/image';
import { RedirectType, redirect } from 'next/navigation';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';

const metadata: Metadata = {
  title: 'Inuwell',
  description: 'Administrator Dashboard',
};

export default function Home() {
  const auth = useSnapshot(authStore);

  useEffect(() => {
    if (auth.isAuthenticated) {
      redirect('/dashboard/questionnaires', RedirectType.replace);
      return;
    }
    redirect('/auth/login', RedirectType.replace);
  }, [auth]);

  return (
    <main className="bg-linear-gradient">
      <div className="flex items-center justify-center flex-col h-screen w-screen animate-pulse">
        <Image
          src="/assets/icons/inuwell_icon.svg"
          width={10}
          height={10}
          className="w-24"
          alt="Inuwell"
        />
        <Image
          src="/assets/icons/inuwell_text.svg"
          width={10}
          height={10}
          className="w-32"
          alt="Inuwell"
        />
      </div>
    </main>
  );
}
