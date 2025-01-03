'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';

function Profile() {
  const { user } = useAuth();
  return (
    <>
      <h1>Profile</h1>
      <p>{user?.username}</p>
      <p>{user?.email}</p>
    </>
  );
}

export default Profile;
