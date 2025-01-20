'use client';

import React, { useState } from 'react';
import { db } from '@/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/app/lib/firebase/AuthContext';

const BooksBasePage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchBooks = async (query, authorName) => {
    if (!query && !authorName) {
      setError('Podaj tytuł książki lub autora.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const titleQuery = query ? `q=${query}` : '';
      const authorQuery = authorName ? `author=${authorName}` : '';
      const separator = query && authorName ? '&' : '';
      const response = await fetch(
        `https://openlibrary.org/search.json?${titleQuery}${separator}${authorQuery}`
      );
      const data = await response.json();

      const filteredBooks = data.docs
        .filter(book => {
          const title = book.title?.toLowerCase() || '';
          const excludedPhrases = [
            'character pop',
            'carnet',
            'gift',
            'calendar',
          ];
          const isExcluded = excludedPhrases.some(phrase =>
            title.includes(phrase)
          );
          return !isExcluded && book.title;
        })
        .slice(0, 10); // Maksymalnie 10 wyników

      setBooks(filteredBooks);
    } catch (err) {
      setError('Nie udało się pobrać książek.');
    } finally {
      setLoading(false);
    }
  };

  const determineCategory = book => {
    if (book.subject) {
      const categories = book.subject.map(s => s.toLowerCase());
      if (categories.includes('fantasy')) return 'Fantasy';
      if (
        categories.includes('science fiction') ||
        categories.includes('sci-fi')
      )
        return 'Sci-Fi';
      if (categories.includes('horror')) return 'Horror';
      if (categories.includes('drama')) return 'Dramat';
      if (categories.includes('biography')) return 'Biografia';
      if (categories.includes('history')) return 'Historia';
    }
    return 'Inne';
  };

  const handleAddBook = async book => {
    if (!user) {
      setError('Musisz być zalogowany, aby dodać książkę.');
      return;
    }

    try {
      const booksRef = collection(db, 'books');
      const category = determineCategory(book);
      await addDoc(booksRef, {
        title: book.title || 'Nieznany tytuł',
        author: book.author_name
          ? book.author_name.join(', ')
          : 'Nieznany autor',
        cover: book.cover_edition_key
          ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
          : '',
        category,
        user: doc(db, 'users', user.uid),
      });
      setSuccessMessage(
        `Dodano książkę: ${
          book.title || 'Nieznany tytuł'
        } (Kategoria: ${category})`
      );
    } catch (err) {
      console.error('Błąd podczas dodawania książki:', err);
      setError('Nie udało się dodać książki.');
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchBooks(search.trim(), author.trim());
  };

  return (
    <section className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Baza Książek</h1>

      <form onSubmit={handleSearch} className="flex flex-col items-center mb-8">
        <div className="mb-4 w-full max-w-md">
          <label htmlFor="search" className="block mb-2 text-sm">
            Tytuł książki (opcjonalny)
          </label>
          <input
            type="text"
            id="search"
            placeholder="Wpisz tytuł książki"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-2 rounded-lg border-gray-700 bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4 w-full max-w-md">
          <label htmlFor="author" className="block mb-2 text-sm">
            Autor (opcjonalny)
          </label>
          <input
            type="text"
            id="author"
            placeholder="Wpisz autora"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="w-full p-2 rounded-lg border-gray-700 bg-gray-800 text-white"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg">
          Szukaj
        </button>
      </form>

      {loading && (
        <p className="text-center text-lg font-semibold">Ładowanie...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {successMessage && (
        <p className="text-center text-green-500">{successMessage}</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <li
            key={book.key}
            className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg flex flex-col items-center">
            {book.cover_edition_key ? (
              <img
                src={`https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`}
                alt={book.title}
                className="mb-4 w-full h-64 object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-700 rounded-lg">
                <p className="text-gray-400">Brak okładki</p>
              </div>
            )}
            <h2 className="text-lg font-semibold text-center">
              {book.title || 'Nieznany tytuł'}
            </h2>
            <p className="text-gray-400 text-center">
              Autor:{' '}
              {book.author_name
                ? book.author_name.join(', ')
                : 'Nieznany autor'}
            </p>
            <p className="text-gray-400 text-center">
              Rok wydania: {book.first_publish_year || 'Nieznany'}
            </p>
            <button
              onClick={() => handleAddBook(book)}
              className="mt-4 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-medium">
              Dodaj
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BooksBasePage;
