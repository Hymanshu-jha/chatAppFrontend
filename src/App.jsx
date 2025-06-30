import './App.css'
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";


import Register from './pages/Register';
import Login from './pages/Login';
import ChatPage from './pages/ChatPage';
import Error from './pages/Errorpage';
import Home from './pages/Home';
import ProtectedRoute from './pages/ProtectedRoute';


import LoadingPage from './pages/LoadingPage';
import { Navbar } from './components/Navbar';




function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/errorpage" element={<Error />} />
        <Route path="/loadingpage" element={<LoadingPage />} />
        {/* Remove old single route */}
        {/* <Route path="/chatpage" element={ <ProtectedRoute><ChatPage /></ProtectedRoute> } /> */}

        {/* Protect parent route */}
        <Route
          path="/chatpage"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        >
        </Route>
      </Routes>
    </>
  );
}

export default App
