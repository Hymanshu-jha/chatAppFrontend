import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <LoadingPage />; // or your <LoadingPage />
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};


export default ProtectedRoute;
