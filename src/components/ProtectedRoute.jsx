import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/auth/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAuth(data.loggedIn));
  }, []);

  if (auth === null) return <p>Loading...</p>;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;