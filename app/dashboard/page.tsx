'use client';

import { RedirectType, redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    redirect('/dashboard/questionnaires', RedirectType.replace);
  }, []);
  return <></>;
}
