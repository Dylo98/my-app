'use client';
function LogoutPage() {
  const handleLogout = () => {
    console.log('Logout button clicked');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <button
        onClick={handleLogout}
        className="rounded-md bg-red-600 px-12 py-3 text-lg font-medium text-white shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800">
        Logout
      </button>
    </div>
  );
}

export default LogoutPage;
