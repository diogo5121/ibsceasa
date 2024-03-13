import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoutes({ children }: Readonly<{ children: React.ReactNode; }>) {
  const router = useRouter();

  useEffect(() => {
    const lastLoginString = localStorage?.getItem('lastLogin');
    
    if (!localStorage?.getItem('token') || !lastLoginString) {
      router.push('/login');
      return;
    }

    const lastLogin = dayjs(lastLoginString);
    const sixHoursAgo = dayjs().subtract(1, 'hours');

    if (lastLogin.isBefore(sixHoursAgo)) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastLogin');
      window.location.reload();
    }

    console.log(localStorage?.getItem('lastLogin'));
  }, []);

  return <>{children}</>;
}
