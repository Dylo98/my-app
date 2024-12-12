'use client';
import Link from 'next/link';
import { useAuth } from '../app/lib/AuthProvider';

function SideBar({ children }) {
  const { user } = useAuth();
  return (
    <>
      <div className="drawer drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {children}
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-60 p-4">
            {/* Sidebar content here */}
            <li>
              <Link href="/user/login">Login</Link>
            </li>
            <li>
              <Link href="/user/logout">Logout</Link>
            </li>
            <li>
              <Link href="/user/profile">{user}</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideBar;
