import { useNavigate } from "react-router-dom";



import './css/auth.css'



export default function Register() {

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const res = await fetch("http://localhost:8080/api/v1/user/signup", {
      method: "POST",
      body: formData,
      credentials: 'include'
    });

    const data = await res.json();  // <-- parse JSON here

    if (!res.ok) {
      if (res.status === 409) {
        // Already registered
        navigate('/login', { state: { message: data.message } });
      } else {
        throw new Error(data.message || 'Signup failed');
      }
      return; // important to stop further execution
    }

    // Success
    navigate('/login');
  } catch (error) {
    console.error("Error:", error);
    navigate("/errorpage", { state: { error: error.message } });
  }
};


  return (
<div className="auth-container">
  <h2><i className="fas fa-user-plus"></i> Register</h2>
  <form onSubmit={handleSubmit}>
    <div className="input-icon">
      {/* <i className="fas fa-user"></i> */}
      <input type="text" id="username" name="name" placeholder="Username" required />
    </div>

    <div className="input-icon">
      {/* <i className="fas fa-envelope"></i> */}
      <input type="email" id="email" name="emailid" placeholder="Email" required />
    </div>

    <div className="input-icon">
      {/* <i className="fas fa-lock"></i> */}
      <input type="password" id="password" name="password" placeholder="Password" required />
    </div>

    <button type="submit">Register</button>
  </form>
</div>

  );
}
