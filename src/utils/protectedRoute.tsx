import { Navigate, Outlet } from "react-router-dom";
import storage from "./storage";
// import useAuthenticatedUser from "src/hooks/queries/useAuthenticatedUser";
import { Role } from "src/constants";

const ProtectedRoute = ({
  permissions = [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
  redirectPath = "/login",
  children,
}) => {
  const token = storage.getAccessToken();
  // const { data: user, isLoading } = useAuthenticatedUser(token);

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  // if (!token && !user) {
  //   return <Navigate to={redirectPath} replace />;
  // }

  // if (!isLoading && user && !permissions.includes(user?.role as Role)) {
  //   // return <Navigate to={"/"} replace />;
  //   return <Navigate to={"/create-place"} replace />;
  // }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
