import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  // Import registerUser from context
  const { login, registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    if (!email.endsWith("@gmail.com")) {
      setError("Email must be a valid @gmail.com address");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!isLogin && username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      if (isLogin) {
        // --- LOGIN ---
        await login(email, password);
      } else {
        // --- REGISTER (Now Auto-Logins) ---
        await registerUser(username, email, password);
      }
      // Both functions update Context, causing a re-render
      // that triggers the PrivateRoute or we force nav here:
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-header">{isLogin ? "Login" : "Register"}</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              className="auth-input"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            className="auth-input"
            required
          />

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setFormData({ username: "", email: "", password: "" });
            }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
