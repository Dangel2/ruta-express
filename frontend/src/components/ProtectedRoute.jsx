import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, type = "client" }) {
  const token =
    type === "admin"
      ? localStorage.getItem("adminToken")
      : localStorage.getItem("token");

  if (!token) {
    return <Navigate to={type === "admin" ? "/admin" : "/login"} replace />;
  }

  return children;
}