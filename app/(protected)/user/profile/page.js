'use client';

import { useAuth } from '@/app/lib/firebase/AuthContext';
import { updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function ProfilePage() {
  const { user, loading } = useAuth();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.uid) {
          const snapshot = await getDoc(doc(db, 'users', user.uid));
          if (snapshot.exists()) {
            const address = snapshot.data()?.address || {};
            setValue('city', address.city || '');
            setValue('street', address.street || '');
            setValue('zipCode', address.zipCode || '');
          }
        }
        setIsLoadingData(false);
      } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
        setErrorMessage('Nie udało się pobrać danych użytkownika.');
        setIsLoadingData(false);
      }
    };
    if (user) {
      setValue('email', user.email || '');
      setValue('displayName', user.displayName || '');
      setValue('photoURL', user.photoURL || '');
      fetchUserData();
    }
  }, [user, setValue]);

  const handleSave = async data => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) throw new Error('Brak zalogowanego użytkownika.');

      await updateProfile(currentUser, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });

      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          address: {
            city: data.city,
            street: data.street,
            zipCode: data.zipCode,
          },
        },
        { merge: true }
      );

      setSuccessMessage('Profil został zaktualizowany!');
      setErrorMessage('');

      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error('Błąd podczas aktualizacji profilu:', error);
      setErrorMessage('Nie udało się zaktualizować profilu.');
      setSuccessMessage('');
    }
  };

  if (loading || isLoadingData) {
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

          <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email (Nieaktywny)
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                readOnly
                className="w-full mt-1 rounded-lg border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 p-3 shadow-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nazwa użytkownika
              </label>
              <input
                type="text"
                id="displayName"
                {...register('displayName')}
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
                {...register('photoURL')}
                className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Ulica
              </label>
              <input
                type="text"
                id="street"
                {...register('street')}
                className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Miasto
              </label>
              <input
                type="text"
                id="city"
                {...register('city')}
                className="w-full mt-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 p-3 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Kod pocztowy
              </label>
              <input
                type="text"
                id="zipCode"
                {...register('zipCode')}
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
