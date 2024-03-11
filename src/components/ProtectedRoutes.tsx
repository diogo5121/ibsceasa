'use client'
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

export default function ProtectedRoutes({ children }: Readonly<{ children: React.ReactNode; }>) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage?.getItem('token')) {
      router.push('/login'); 
    }
  }, []); 
  return <>{children}</>;
}
