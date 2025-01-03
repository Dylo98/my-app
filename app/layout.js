import localFont from 'next/font/local';
import './globals.css';
import SideBar from '@/components/SideBar';
import Footer from '@/components/Footer';
import { AuthProvider } from './lib/firebase/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` bg-white dark:bg-gray-900 flex flex-col min-h-screen`}>
        <AuthProvider>
          <div className="flex flex-1">
            <SideBar>{children}</SideBar>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
