function ProfileForm() {
  return (
    <section className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl w-full">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
              Profile
            </h1>

            <form action="#" className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label
                  htmlFor="Username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Username
                </label>
                <input
                  type="text"
                  id="Username"
                  name="username"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 py-3 px-4"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="PhotoURL"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="PhotoURL"
                  name="photoURL"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 py-3 px-4"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  readOnly
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-lg text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 py-3 px-4"
                />
              </div>

              <div className="col-span-6">
                <button className="inline-block rounded-md bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default ProfileForm;
