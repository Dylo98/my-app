'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/firebase/AuthContext';

export default function VerifyEmail() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user?.emailVerified) {
        router.push('/user/profile');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-700">
        Email nie został zweryfikowany
      </h1>
      <p className="text-gray-500">
        Sprawdź swoją skrzynkę e-mail ({user?.email}), aby aktywować konto.
      </p>
    </div>
  );
}
