import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setLogin } from '../redux/features/users/loginSlice';

const baseURL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const message = location.state?.message || "";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch(`${baseURL}/api/v1/user/signin`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) throw new Error('error while submitting Login form');

      const data = await res.json();
      dispatch(setLogin(data.user));

      console.log(`state before login is: ${isLoggedIn}`);
      navigate('/loadingpage');
      setTimeout(() => {
        navigate('/chatpage');
      }, 2000);
    } catch (error) {
      navigate('/errorpage', { state: { error: error } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8 flex items-center justify-center gap-2">
          <i className="fas fa-sign-in-alt text-blue-500"></i>
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition duration-200 ease-in-out"
          >
            Sign In
          </button>
        </form>

        {message && (
          <div className="mt-6 px-4 py-3 rounded-xl border border-green-400 bg-green-100 text-green-800 font-medium text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
