import React, { ReactNode, useEffect, useState } from "react";
import SideBar from "./SideBar";
import AccessControlSidebar from "../components/AccessControl/AccessControlSidebar/AccessControlSidebar";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import storage from "../utils/storage";

interface DecodedToken {
  role: string;
}

const Layout = (props: { children: ReactNode }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAccessControl, setIsAccessControl] = useState(false);

  useEffect(() => {
    const checkUserRole = () => {
      const token = storage.getAccessToken();
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setIsAccessControl(decoded.role === "STAFF_ACCESS_CONTROL");
      }
      setIsLoading(false);
    };
    
    checkUserRole();
  }, [location.pathname]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = storage.getAccessToken();
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setIsAccessControl(decoded.role === "STAFF_ACCESS_CONTROL");
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isLoading) {
    return null; 
  }

  return (
    <div>
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        {location.pathname !== "/login" &&
          location.pathname !== "/logout" &&
          location.pathname !== "/your-places" &&
          location.pathname !== "/forgot-password" &&
          !location.pathname.includes("/register") &&
          !location.pathname.includes("/reset-password") &&
          !location.pathname.includes("/email-verification") && 
          (isAccessControl ? <AccessControlSidebar /> : <SideBar />)}
      </div>
      {props.children}
    </div>
  );
};

export default Layout;
