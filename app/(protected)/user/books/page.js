'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { fetchUserBooks } from '@/utils/fetchBooks';
import { db } from '@/firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const BooksPage = () => {
  const { user, loading } = useAuth();

  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [newBook, setNewBook] = useState({
    title: '',
    category: '',
    cover: '',
    author: '',
  });

  const [newBookErrors, setNewBookErrors] = useState({});

  const [editingBook, setEditingBook] = useState(null);

  const [editBookErrors, setEditBookErrors] = useState({});

  const [filter, setFilter] = useState({ title: '', category: '', author: '' });

  const categories = [
    'Fantasy',
    'Kryminał',
    'Thriller',
    'Sci-Fi',
    'Horror',
    'Dramat',
    'Komedia',
    'Biznes, rozwój',
    'Inne',
  ];

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
        console.error(err);
        setError('Nie udało się pobrać książek.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [user]);

  const validateNewBook = () => {
    const errors = {};
    if (!newBook.title.trim()) {
      errors.title = 'Tytuł jest wymagany.';
    }
    if (!newBook.category.trim()) {
      errors.category = 'Kategoria jest wymagana.';
    }
    if (!newBook.author.trim()) {
      errors.author = 'Autor jest wymagany.';
    }
    setNewBookErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditedBook = () => {
    const errors = {};
    if (!editingBook.title.trim()) {
      errors.title = 'Tytuł jest wymagany.';
    }
    if (!editingBook.category.trim()) {
      errors.category = 'Kategoria jest wymagana.';
    }
    if (!editingBook.author.trim()) {
      errors.author = 'Autor jest wymagany.';
    }
    setEditBookErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddBook = async e => {
    e.preventDefault();

    if (!validateNewBook()) {
      return;
    }

    try {
      const booksRef = collection(db, 'books');
      await addDoc(booksRef, {
        title: newBook.title,
        category: newBook.category,
        cover: newBook.cover || '',
        author: newBook.author,
        user: doc(db, 'users', user?.uid),
      });
      setBooks([
        ...books,
        {
          title: newBook.title,
          category: newBook.category,
          cover: newBook.cover || '',
          author: newBook.author,
        },
      ]);
      setNewBook({ title: '', category: '', cover: '', author: '' });
      setNewBookErrors({});
      setError('');
    } catch (err) {
      console.error('Nie udało się dodać książki:', err);
      setError('Nie udało się dodać książki.');
    }
  };

  const handleEditBook = book => {
    setEditingBook(book);
    setEditBookErrors({});
  };

  const handleUpdateBook = async e => {
    e.preventDefault();

    if (!validateEditedBook()) {
      return;
    }

    try {
      const bookRef = doc(db, 'books', editingBook.id);
      await updateDoc(bookRef, {
        title: editingBook.title,
        category: editingBook.category,
        cover: editingBook.cover || '',
        author: editingBook.author,
      });
      setBooks(
        books.map(book => (book.id === editingBook.id ? editingBook : book))
      );
      setEditingBook(null);
      setEditBookErrors({});
      setError('');
    } catch (err) {
      console.error('Nie udało się zaktualizować książki:', err);
      setError('Nie udało się zaktualizować książki.');
    }
  };

  const handleDeleteBook = async () => {
    if (!editingBook) return;
    try {
      const bookRef = doc(db, 'books', editingBook.id);
      await deleteDoc(bookRef);
      setBooks(books.filter(book => book.id !== editingBook.id));
      setEditingBook(null);
      setEditBookErrors({});
      setError('');
    } catch (err) {
      console.error('Nie udało się usunąć książki:', err);
      setError('Nie udało się usunąć książki.');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesTitle = book.title
      ?.toLowerCase()
      .includes(filter.title.toLowerCase());
    const matchesCategory = filter.category
      ? book.category === filter.category
      : true;
    const matchesAuthor = book.author
      ?.toLowerCase()
      .includes(filter.author.toLowerCase());
    return matchesTitle && matchesCategory && matchesAuthor;
  });

  if (!user && !loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-lg font-semibold">
        Nie jesteś zalogowany. Przejdź do logowania.
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-white">
        Ładowanie książek...
      </div>
    );
  }

  if (error && !editingBook && !newBook) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <section className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Twoje książki</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
        {/* Sekcja filtrowania */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Filtruj książki
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="filterTitle"
                className="block text-sm font-medium text-gray-300 mb-1">
                Tytuł
              </label>
              <input
                id="filterTitle"
                type="text"
                value={filter.title}
                onChange={e => setFilter({ ...filter, title: e.target.value })}
                className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-2 shadow-sm focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="filterCategory"
                className="block text-sm font-medium text-gray-300 mb-1">
                Kategoria
              </label>
              <select
                id="filterCategory"
                value={filter.category}
                onChange={e =>
                  setFilter({ ...filter, category: e.target.value })
                }
                className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-2 shadow-sm focus:ring focus:ring-blue-500">
                <option value="">Wszystkie</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="filterAuthor"
                className="block text-sm font-medium text-gray-300 mb-1">
                Autor
              </label>
              <input
                id="filterAuthor"
                type="text"
                value={filter.author}
                onChange={e => setFilter({ ...filter, author: e.target.value })}
                className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-2 shadow-sm focus:ring focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sekcja dodawania nowej książki */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Dodaj nową książkę
          </h2>
          <form onSubmit={handleAddBook} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1">
                Tytuł książki
              </label>
              <input
                id="title"
                type="text"
                value={newBook.title}
                onChange={e =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-2 shadow-sm focus:ring focus:ring-blue-500"
              />
              {newBookErrors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {newBookErrors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-1">
                Kategoria
              </label>
              <select
                id="category"
                value={newBook.category}
                onChange={e =>
                  setNewBook({ ...newBook, category: e.target.value })
                }
                className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-2 shadow-sm focus:ring focus:ring-blue-500">
                <option value="">Wybierz kategorię</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {newBookErrors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {newBookErrors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-300 mb-1">
                Autor
              </label>
              <input
                id="author"
                type="text"
                value={newBook.author}
                onChange={e =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-2 shadow-sm focus:ring focus:ring-blue-500"
              />
              {newBookErrors.author && (
                <p className="text-red-500 text-sm mt-1">
                  {newBookErrors.author}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cover"
                className="block text-sm font-medium text-gray-300 mb-1">
                Link do okładki (opcjonalne)
              </label>
              <input
                id="cover"
                type="url"
                value={newBook.cover}
                onChange={e =>
                  setNewBook({ ...newBook, cover: e.target.value })
                }
                className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-2 shadow-sm focus:ring focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow hover:bg-blue-600">
              Dodaj książkę
            </button>
          </form>
        </div>
      </div>
      {/* Lista książek */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book, index) => (
          <li
            key={book.id || index}
            className="hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer"
            onClick={() => handleEditBook(book)}>
            {book.cover ? (
              <img
                src={book.cover}
                alt={book.title}
                className="mb-4 w-full h-auto max-h-64 object-contain"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <p className="text-gray-400">Brak okładki</p>
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2 text-white text-center">
              {book.title}
            </h2>
            <p className="text-gray-400 text-center">
              Kategoria: {book.category}
            </p>
            <p className="text-gray-400 text-center">Autor: {book.author}</p>
          </li>
        ))}
      </ul>
      {/* Modal edycji książki */}
      {editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edytuj książkę</h2>
            <form onSubmit={handleUpdateBook} className="space-y-4">
              <div>
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Tytuł książki
                </label>
                <input
                  id="editTitle"
                  type="text"
                  value={editingBook.title}
                  onChange={e =>
                    setEditingBook({ ...editingBook, title: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-3 shadow-sm focus:ring focus:ring-blue-500"
                />
                {editBookErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {editBookErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="editCategory"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Kategoria
                </label>
                <select
                  id="editCategory"
                  value={editingBook.category}
                  onChange={e =>
                    setEditingBook({ ...editingBook, category: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-3 shadow-sm focus:ring focus:ring-blue-500">
                  <option value="">Wybierz kategorię</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {editBookErrors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {editBookErrors.category}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="editAuthor"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Autor
                </label>
                <input
                  id="editAuthor"
                  type="text"
                  value={editingBook.author}
                  onChange={e =>
                    setEditingBook({ ...editingBook, author: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-3 shadow-sm focus:ring focus:ring-blue-500"
                />
                {editBookErrors.author && (
                  <p className="text-red-500 text-sm mt-1">
                    {editBookErrors.author}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="editCover"
                  className="block text-sm font-medium text-gray-300 mb-1">
                  Link do okładki (opcjonalne)
                </label>
                <input
                  id="editCover"
                  type="url"
                  value={editingBook.cover}
                  onChange={e =>
                    setEditingBook({ ...editingBook, cover: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-600 bg-gray-700 text-gray-300 p-3 shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleDeleteBook}
                  className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-red-600">
                  Usuń
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  className="rounded-lg bg-gray-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-gray-600">
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-600">
                  Zapisz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default BooksPage;
