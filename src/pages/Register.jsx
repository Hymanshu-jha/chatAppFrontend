import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${baseURL}/api/v1/user/signup`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          navigate('/login', {
            state: {
              message: "User already exists. Please log in or check your email for verification.",
            },
          });
        } else {
          throw new Error(data.message || 'Signup failed');
        }
        return;
      }

      navigate('/login', {
        state: {
          message: "We have sent a verification email. Please check your inbox.",
        },
      });

    } catch (error) {
      console.error("Error:", error);
      navigate("/errorpage", { state: { error: error.message } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8 flex items-center justify-center gap-2">
          <i className="fas fa-user-plus text-green-500"></i>
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="name"
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="emailid"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow transition duration-200 ease-in-out"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
