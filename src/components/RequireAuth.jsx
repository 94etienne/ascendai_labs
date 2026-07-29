import { Navigate, useLocation } from "react-router-dom";

/* Blocks a route unless a JWT is present.
   This is a UX guard, NOT a security control — the real check
   happens server-side on every /api call. A user who forges
   localStorage gets an empty dashboard and a 401, not data. */
export default function RequireAuth({ children }) {
  const token = localStorage.getItem("ascend_jwt");
  const location = useLocation();

  if (!token) {
    /* Remember where they were headed, so login can send them
       back there instead of dumping them on the home page. */
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
