'use client';

import { useAuth } from '@/app/lib/firebase/AuthContext';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        {user
          ? `Witaj, ${user.displayName || 'Użytkowniku'}!`
          : 'Witaj w aplikacji!'}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
        {user
          ? 'Cieszymy się, że jesteś z nami. Możesz teraz korzystać ze wszystkich funkcji.'
          : 'To jest strona główna aplikacji. Możesz się zalogować lub zarejestrować, aby uzyskać więcej funkcji.'}
      </p>
    </div>
  );
}

export default HomePage;
