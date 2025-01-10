'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '@/firebase';

function ProfilePage() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user && !loading) {
      setUsername(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, loading]);

  const handleSave = async e => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) throw new Error('Brak zalogowanego użytkownika.');

      await updateProfile(currentUser, {
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
    <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Formularz edycji profilu */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Edycja profilu
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email (Nieaktywny)
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                readOnly
                className="w-full mt-1 rounded-lg border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 p-3 shadow-sm cursor-not-allowed"
              />
            </div>

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

            <button
              type="submit"
              className="w-full mt-4 rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-blue-600">
              Zapisz zmiany
            </button>
          </form>
        </div>

        {/* Dane użytkownika */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Dane użytkownika
          </h1>
          <div className="space-y-4">
            <div>
              <strong className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nazwa użytkownika:
              </strong>
              <p className="text-gray-800 dark:text-gray-200">
                {user.displayName || 'Nie ustawiono'}
              </p>
            </div>
            <div>
              <strong className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email:
              </strong>
              <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
            </div>
            <div>
              <strong className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Zdjęcie profilowe:
              </strong>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Zdjęcie profilowe"
                  className="mt-2 w-20 h-20 rounded-full shadow"
                />
              ) : (
                <p className="text-gray-800 dark:text-gray-200">Brak zdjęcia</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
