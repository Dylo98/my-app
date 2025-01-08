'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { useState } from 'react';

function RegistrationForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [registrationError, setRegistrationError] = useState('');

  const onSubmit = async data => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.username,
      });

      console.log('Użytkownik zarejestrowany z nazwą:', data.username);

      await signOut(auth);

      router.push('/user/login');
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      setRegistrationError('Rejestracja nie powiodła się. Spróbuj ponownie.');
    }
  };

  const password = watch('password');

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Rejestracja</h1>
        <p className="mt-4 text-gray-500">
          Utwórz swoje konto, aby korzystać z aplikacji.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-md space-y-4">
        {registrationError && (
          <div className="text-red-500 text-sm font-medium">
            {registrationError}
          </div>
        )}

        {/* Nazwa użytkownika */}
        <div>
          <label htmlFor="username" className="sr-only">
            Nazwa użytkownika
          </label>
          <input
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
            placeholder="Wprowadź nazwę użytkownika"
            id="username"
            type="text"
            {...register('username', {
              required: 'Nazwa użytkownika jest wymagana!',
              maxLength: {
                value: 20,
                message: 'Nazwa użytkownika jest za długa!',
              },
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
            placeholder="Wprowadź email"
            id="email"
            type="email"
            {...register('email', {
              required: 'Email jest wymagany!',
              maxLength: { value: 40, message: 'Email jest za długi!' },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Niepoprawny adres email!',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Hasło */}
        <div>
          <label htmlFor="password" className="sr-only">
            Hasło
          </label>
          <input
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
            type="password"
            id="password"
            placeholder="Wprowadź hasło"
            {...register('password', {
              required: 'Hasło jest wymagane!',
              minLength: {
                value: 6,
                message: 'Hasło musi mieć co najmniej 6 znaków!',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Potwierdź hasło */}
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Potwierdź hasło
          </label>
          <input
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
            type="password"
            id="confirmPassword"
            placeholder="Potwierdź hasło"
            {...register('confirmPassword', {
              required: 'Potwierdzenie hasła jest wymagane!',
              validate: value =>
                value === password || 'Hasła muszą być zgodne!',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs italic">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Przycisk Zarejestruj */}
        <button
          type="submit"
          className="inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white">
          Zarejestruj
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;
