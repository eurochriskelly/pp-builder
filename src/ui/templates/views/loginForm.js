module.exports = function generateLoginForm(errorMessage = null) {
  return `
    <div id="login-form-container" class="p-4 max-w-md mx-auto">
      <h2 class="text-2xl font-bold mb-4">Log In</h2>
      ${errorMessage ? `<p class="text-red-500 mb-4">${errorMessage}</p>` : ''}
      <form hx-post="/login" hx-target="body" hx-swap="outerHTML" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input type="email" id="email" name="email" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input type="password" id="password" name="password" required
                 class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <button type="submit"
                  style="background-color: blue; color: white; padding: 10px; border: 1px solid black; display: block; width: 100%; text-align: center;">
            Log In
          </button>
        </div>
      </form>
      <p class="mt-4 text-center">
        <a href="/" hx-get="/" hx-target="body" hx-swap="outerHTML" class="text-indigo-600 hover:text-indigo-500">Cancel</a>
      </p>
    </div>
  `;
};
