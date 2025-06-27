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
    <nav className="bg-gray-950 shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <ul className="flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-orange-500 bg-gray-800' 
                    : 'text-gray-300 hover:text-orange-500 hover:bg-gray-800'
                }`
              }
            >
              <AiOutlineHome className="w-10 h-10 mr-2" />
              Home
            </NavLink>
            <NavLink 
              to="/chatpage" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-orange-500 bg-gray-800' 
                    : 'text-gray-300 hover:text-orange-500 hover:bg-gray-800'
                }`
              }
            >
              <FaComments className="w-10 h-10 mr-2" />
              ChatPage
            </NavLink>
          </ul>

          {isLoggedIn ? (
            <ul className="flex">
              <NavLink 
                to="#" 
                onClick={handleClickLogout} 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
              >
                <AiOutlineLogout className="w-10 h-10 mr-2" />
                Logout
              </NavLink>
            </ul>
          ) : (
            <ul className="flex space-x-4">
              <NavLink 
                to="/register" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-orange-500 hover:bg-gray-800 transition-colors"
              >
                <AiOutlineUserAdd className="w-5 h-5 mr-2" />
                Register
              </NavLink>
              <NavLink 
                to="/login" 
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <AiOutlineLogin className="w-5 h-5 mr-2" />
                Login
              </NavLink>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};