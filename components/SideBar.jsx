'use client';
import Link from 'next/link';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { useState } from 'react';

function SideBar({ children }) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="lg:hidden p-4">
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 7.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
          </svg>
        </button>
      </div>

      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isMenuOpen}
          readOnly
        />

        <div
          className={`drawer-content flex justify-center items-center min-h-screen bg-gray-900 transition-all`}>
          {children}
        </div>

        <div
          className={`drawer-side ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
          {isMenuOpen && (
            <div
              className="absolute inset-0 bg-black opacity-50 lg:hidden"
              onClick={closeMenu}></div>
          )}

          <div
            className={`bg-base-200 text-base-content min-h-screen ${
              isMenuOpen ? 'w-full' : 'w-72'
            } lg:w-72 p-4 relative`}>
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Lista menu */}
            <ul className="menu space-y-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link href="/user/profile">Twój profil</Link>
                  </li>
                  <li>
                    <Link href="/user/books">Książki</Link>
                  </li>
                  <li>
                    <Link href="/user/booksBase">Baza książek</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-600">
                      Wyloguj
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/user/login">Login</Link>
                  </li>
                  <li>
                    <Link href="/user/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
