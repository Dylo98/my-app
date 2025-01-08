'use client';
import { useRouter } from 'next/navigation';
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '@/firebase';
import { useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = useState('');

  const onSubmit = async data => {
    try {
      await setPersistence(auth, browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log('Użytkownik zalogowany:', userCredential.user);

      router.push('/user/profile');
    } catch (error) {
      console.error('Błąd logowania:', error);
      if (error.code === 'auth/user-not-found') {
        setLoginError('Użytkownik o podanym adresie e-mail nie istnieje.');
      } else if (error.code === 'auth/wrong-password') {
        setLoginError('Podane hasło jest nieprawidłowe.');
      } else if (error.code === 'auth/too-many-requests') {
        setLoginError(
          'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.'
        );
      } else {
        setLoginError('Wystąpił błąd. Spróbuj ponownie.');
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Zaloguj się</h1>
        <p className="mt-4 text-gray-500">
          Wprowadź swoje dane logowania, aby uzyskać dostęp.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mt-8 max-w-md space-y-4">
        {loginError && (
          <div className="text-red-500 text-sm font-medium">{loginError}</div>
        )}
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

        <div>
          <label htmlFor="password" className="sr-only">
            Hasło
          </label>
          <input
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
            type="password"
            id="password"
            placeholder="Wprowadź hasło"
            {...register('password', { required: 'Hasło jest wymagane!' })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-block w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white">
          Zaloguj się
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
