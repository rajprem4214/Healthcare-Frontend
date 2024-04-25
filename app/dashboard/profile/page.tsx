'use client';
import { RedirectType, redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  useEffect(() => {
    redirect('/dashboard/profile/personal', RedirectType.replace);
  }, []);
  return <></>;
}
