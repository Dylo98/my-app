'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';

function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout(); // Wywołanie funkcji wylogowania
      router.replace('/'); // Przekierowanie na stronę główną
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <button
        onClick={handleLogout}
        className="rounded-md bg-red-600 px-12 py-3 text-lg font-medium text-white shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800">
        Logout
      </button>
    </div>
  );
}

export default LogoutPage;
