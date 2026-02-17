import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  // If still loading user data, show nothing or a spinner
  if (loading) return <div>Loading...</div>;

  // If no user, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
