import { Navigate } from "react-router-dom";

const PublicRoute = ({ loggedIn, children }) => {
  if (loggedIn) return <Navigate to="/dashboard" replace />;
  return children;
};

export default PublicRoute;