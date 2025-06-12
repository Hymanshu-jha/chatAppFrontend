import './App.css'
import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";


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
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/errorpage' element={<Error />} />
          <Route path='/loadingpage' element={<LoadingPage />} />
{/* <Route path='/kanban' element={<Kanban />} /> */}
          

         {/* Protect this route */}
          <Route
          path="/chatpage"
          element={
           <ProtectedRoute>
             <ChatPage />
           </ProtectedRoute>
                  }
        />
       </Routes>

      

    </>
  )
}

export default App
