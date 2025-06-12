import { useNavigate } from "react-router-dom";
import { Navbar } from '../components/Navbar'
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setLogin } from '../redux/features/users/loginSlice';



import './css/auth.css'




const Login = () => {

    
    const { isLoggedIn } = useSelector((state) => state.auth);
  


    const dispatch = useDispatch();

    const location = useLocation();
    const message = location.state?.message || null;
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
       e.preventDefault();

       const formData = new FormData(e.target);

       try {
        const res = await fetch('http://localhost:8080/api/v1/user/signin', {
           method: "POST",
           body: formData,
           credentials: 'include',
        });
        if(!res.ok)throw new Error('error while submitting Login form');
        //change login status from store here

        // Parse the JSON response first
        const data = await res.json();
    
    // Then dispatch the user data
        dispatch(setLogin(data.user));
// userData = { id, name, email, ... }

        console.log(`state before login is: ${isLoggedIn}`);
         navigate('/loadingpage');
         setTimeout(()=>{navigate('/chatpage');}, 2000);
         
        
       } catch (error) {
        navigate('/errorpage', {state: {error: error}});
        console.log()
       }
    }


  return (
    <>
      

<div className="auth-container">
  <h2><i className="fas fa-sign-in-alt"></i> Login</h2>
  <form onSubmit={handleSubmit}>
    <div className="input-icon">
      {/* <i className="fas fa-envelope"></i> */}
      <input type="email" id="email" name="emailid" placeholder="Email" required />
    </div>

    <div className="input-icon">
      {/* <i className="fas fa-lock"></i> */}
      <input type="password" id="password" name="password" placeholder="Password" required />
    </div>

    <button type="submit">Login</button>
  </form>

  {message && (
    <div className="auth-message success">
      <i className="fas fa-info-circle"></i> You are already registered: {message.message}
    </div>
  )}
</div>


      

    </>
  );
}

export default Login