'use client';
import Link from 'next/link';
import { useAuth } from '@/app/lib/firebase/AuthContext';

function SideBar({ children }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  return (
    <>
      <div className="drawer drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">{children}</div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href="/user/profile">Profile</Link>
                </li>
                <li>
                  <Link href="/user/books">Books</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-red-600">
                    Logout
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
    </>
  );
}

export default SideBar;
