'use client';

import { useRouter } from 'next/navigation';
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  signOut,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '@/firebase';

function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    try {
      await setPersistence(auth, browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        router.push('/user/verify');
        return;
      }

      console.log('Użytkownik zalogowany:', user);

      router.push('/user/profile');
    } catch (error) {
      console.error('Błąd logowania:', error);
      console.log('Kod błędu Firebase:', error.code);
      if (error.code === 'auth/user-not-found') {
        setError('email', {
          type: 'manual',
          message: 'Użytkownik o podanym adresie e-mail nie istnieje.',
        });
      } else if (error.code === 'auth/wrong-password') {
        setError('password', {
          type: 'manual',
          message: 'Podane hasło jest nieprawidłowe.',
        });
      } else if (error.code === 'auth/invalid-credential') {
        setError('email', {
          type: 'manual',
          message:
            'Nieprawidłowe dane logowania. Sprawdź adres e-mail i hasło.',
        });
      } else if (error.code === 'auth/too-many-requests') {
        setError('email', {
          type: 'manual',
          message:
            'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.',
        });
      } else {
        setError('email', {
          type: 'manual',
          message: 'Wystąpił nieznany błąd. Spróbuj ponownie.',
        });
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
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs italic mb-2">
              {errors.email.message}
            </p>
          )}
          <input
            className={`w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
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
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Hasło
          </label>
          {errors.password && (
            <p className="text-red-500 text-xs italic mb-2">
              {errors.password.message}
            </p>
          )}
          <input
            className={`w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm ${
              errors.password ? 'border-red-500' : ''
            }`}
            type="password"
            id="password"
            placeholder="Wprowadź hasło"
            {...register('password', { required: 'Hasło jest wymagane!' })}
          />
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
