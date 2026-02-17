import { useState, useEffect, useContext } from "react";
import { clientServer } from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", email: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await clientServer.get("/users/profile");
        setFormData({ username: res.data.username, email: res.data.email });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await clientServer.put("/users/profile", formData);
      setMessage({ type: "success", text: "Profile Updated Successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Update Failed" });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/")}
            >
              Back to Dashboard
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
