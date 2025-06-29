import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogin, logout } from '../redux/features/users/loginSlice';
import LoadingPage from '../pages/LoadingPage';
const baseURL = import.meta.env.VITE_API_URL;

// Icons
import { AiOutlineHome, AiOutlineLogout, AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai';
import { FaComments } from 'react-icons/fa';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    fetch(`${baseURL}/api/v1/user/refresh`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          dispatch(setLogin(data.user));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => dispatch(logout()));
  }, [dispatch]);

  const handleClickLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/loadingpage');
      setTimeout(handleClick, 2000);
    }
  };

  const handleClick = async () => {
    try {
      const res = await fetch(`${baseURL}/api/v1/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        dispatch(logout());
        navigate('/login');
      } else {
        console.log('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <nav className="bg-black shadow-xl border-b border-gray-800 sticky top-0 z-50 rounded-b-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-0">
          {/* Navigation Links */}
          <ul className="flex flex-row gap-4 sm:gap-7 items-center p-0 m-0">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform select-none cursor-pointer ${
                    isActive 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/50 scale-105' 
                      : 'text-gray-300 hover:bg-green-700 hover:text-white hover:scale-105'
                  }`
                }
              >
                <AiOutlineHome className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-sm sm:text-base">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/chatpage" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out transform select-none cursor-pointer ${
                    isActive 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/50 scale-105' 
                      : 'text-gray-300 hover:bg-green-700 hover:text-white hover:scale-105'
                  }`
                }
              >
                <FaComments className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-sm sm:text-base">ChatPage</span>
              </NavLink>
            </li>
          </ul>

          {/* Authentication Links */}
          {isLoggedIn ? (
            <ul className="flex items-center p-0 m-0">
              <li>
                <NavLink 
                  to="#" 
                  onClick={handleClickLogout} 
                  className="flex items-center px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 hover:scale-110 transition-all duration-300 ease-in-out transform select-none cursor-pointer"
                >
                  <AiOutlineLogout className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  <span className="text-sm sm:text-base">Logout</span>
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-3 sm:gap-4 items-center p-0 m-0">
              <li>
                <NavLink 
                  to="/register" 
                  className="flex items-center px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out transform select-none cursor-pointer"
                >
                  <AiOutlineUserAdd className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Register</span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/login" 
                  className="flex items-center px-3 py-2 sm:px-5 sm:py-3 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 hover:scale-105 transition-all duration-300 ease-in-out transform select-none cursor-pointer"
                >
                  <AiOutlineLogin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Login</span>
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};