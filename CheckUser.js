import React from "react";
import { useNavigate } from "react-router-dom";
import useSession from "../Hooks/useSession";

//CheckUser -- initial planned for keycloak but keeping it
export default function CheckUser({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, loadingSession } = useSession();

  React.useEffect(() => {
    if (!loadingSession && !isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, loadingSession, navigate]);

  if (loadingSession) return null;
  return isAuthenticated ? children : null;
}
