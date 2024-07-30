import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../hooks/AuthContext";

export const PrivateRoutes = () => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};
