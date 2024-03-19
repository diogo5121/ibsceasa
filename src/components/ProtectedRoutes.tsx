import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoutes({ children }: Readonly<{ children: React.ReactNode; }>) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const lastLoginString = localStorage?.getItem('lastLogin');
    
    if (!localStorage?.getItem('token') || !lastLoginString) {
      router.push('/login');
      return;
    }

    const lastLogin = dayjs(lastLoginString);
    const sixHoursAgo = dayjs().subtract(4, 'hours');

    if (lastLogin.isBefore(sixHoursAgo)) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastLogin');
      window.location.reload();
    }

    setIsAuthenticated(true);

  }, [router]);

  return isAuthenticated ? <>{children}</> : null;
}
