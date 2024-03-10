'use client'
import { useRouter } from 'next/navigation';

import { useLayoutEffect } from 'react';

export default function ProtectedRoutes({ children }: Readonly<{ children: React.ReactNode; }>) {
  const router = useRouter();
  useLayoutEffect(() => {
    if (!localStorage?.getItem('token')) {
      router.push('/login'); 
    }
  }, []); 
  return <>{children}</>;
}
