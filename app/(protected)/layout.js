'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';

function ProfileLayout({ children }) {
  const { user } = useAuth();

  return (
    <div>
      <div>{children}</div>
    </div>
  );
}

export default ProfileLayout;
