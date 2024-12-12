import localFont from 'next/font/local';
import './globals.css';
import SideBar from '@/components/SideBar';
import Footer from '@/components/Footer';
import { AuthProvider } from './lib/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` bg-white dark:bg-gray-900`}>
        <AuthProvider>
          <SideBar>
            {children}
            <Footer />
          </SideBar>
        </AuthProvider>
      </body>
    </html>
  );
}
