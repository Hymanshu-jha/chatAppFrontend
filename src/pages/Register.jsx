import { useNavigate } from "react-router-dom";



import './css/auth.css'


const baseURL = import.meta.env.VITE_API_URL;



export default function Register() {
  console.log(`baseURL: ${baseURL}`);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${baseURL}/api/v1/user/signup`, {
        method: "POST",
        body: formData,
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // User already exists — optionally navigate with a different message
          navigate('/login', {
            state: {
              message: "User already exists. Please log in or check your email for verification instructions."
            }
          });
        } else {
          throw new Error(data.message || 'Signup failed');
        }
        return;
      }

      // ✅ Success — navigate with success message
      navigate('/login', {
        state: {
          message: "We have sent you a verification mail on your registered email id, please verify."
        }
      });

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
          <input type="text" id="username" name="name" placeholder="Username" required />
        </div>

        <div className="input-icon">
          <input type="email" id="email" name="emailid" placeholder="Email" required />
        </div>

        <div className="input-icon">
          <input type="password" id="password" name="password" placeholder="Password" required />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
