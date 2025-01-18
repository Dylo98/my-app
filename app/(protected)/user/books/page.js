'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { fetchUserBooks } from '@/utils/fetchBooks';

const BooksPage = () => {
  const { user, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      if (!user) {
        setError('Musisz być zalogowany, aby zobaczyć swoje książki.');
        setIsLoading(false);
        return;
      }

      try {
        const booksData = await fetchUserBooks(user);
        setBooks(booksData);
      } catch (err) {
        setError('Nie udało się pobrać książek.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-white">
        Ładowanie książek...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <section className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Twoje książki</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <li
            key={book.id}
            className="bg-gray-800 shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-white">
              {book.title}
            </h2>
            <p className="text-gray-400">Kategoria: {book.category}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BooksPage;
