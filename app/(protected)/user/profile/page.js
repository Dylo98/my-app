'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';

function ProfilePage() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('User data in ProfilePage:', user); // Debugowanie danych użytkownika
    if (user && !loading) {
      setUsername(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, loading]);

  const handleSave = async e => {
    e.preventDefault();

    try {
      if (!user) throw new Error('Brak użytkownika!');
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: photoURL,
      });
      setSuccessMessage('Profil został zaktualizowany!');
      setErrorMessage('');
    } catch (error) {
      console.error('Błąd podczas aktualizacji profilu:', error);
      setErrorMessage('Nie udało się zaktualizować profilu.');
      setSuccessMessage('');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Ładowanie danych użytkownika...
        </h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Nie jesteś zalogowany. Przejdź do logowania.
        </h1>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Twój Profil
        </h1>

        {successMessage && (
          <div className="mb-4 text-green-500 text-sm">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="photoURL"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Zdjęcie profilowe (URL)
            </label>
            <input
              type="url"
              id="photoURL"
              value={photoURL}
              onChange={e => setPhotoURL(e.target.value)}
              className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email (Nieaktywny)
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="w-full mt-1 rounded-lg border-gray-300 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 p-3 shadow-sm cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-blue-600">
            Zapisz zmiany
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;
