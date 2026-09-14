import { Navigate } from "react-router-dom";

export default function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("studentToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}