import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogin, logout } from '../redux/features/users/loginSlice';
import LoadingPage from '../pages/LoadingPage';
const baseURL = import.meta.env.VITE_API_URL;

// Icons
import { AiOutlineHome, AiOutlineLogout, AiOutlineLogin, AiOutlineUserAdd } from 'react-icons/ai';
import { FaComments } from 'react-icons/fa';

import './css/Navbar.css';

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
    <nav className="navbar">
      <ul className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}>
          <AiOutlineHome className="icon" />
          Home
        </NavLink>
        <NavLink to="/chatpage" className={({ isActive }) => (isActive ? 'nav-link active-link' : 'nav-link')}>
          <FaComments className="icon" />
          ChatPage
        </NavLink>
      </ul>

      {isLoggedIn ? (
        <ul className="auth-links">
          <NavLink to="#" onClick={handleClickLogout} className="auth-link logout-link">
            <AiOutlineLogout className="icon" />
            Logout
          </NavLink>
        </ul>
      ) : (
        <ul className="auth-links">
          <NavLink to="/register" className="auth-link">
            <AiOutlineUserAdd className="icon" />
            Register
          </NavLink>
          <NavLink to="/login" className="auth-link">
            <AiOutlineLogin className="icon" />
            Login
          </NavLink>
        </ul>
      )}
    </nav>
  );
};
