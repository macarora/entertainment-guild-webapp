import { useState, useEffect } from "react";

//setting up the useSession so that I can just call it ont he pages I need

export default function useSession() {
  const [userInfo, setUserInfo] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  //useffect for session storage
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoadingSession(false);
  }, []);

  // storing session for login
  const login = (data) => {
    setUserInfo(data);
    setIsAuthenticated(true);
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  // storing session for logout -- to clear the session on logout
  const logout = () => {
    setUserInfo(null);
    setIsAuthenticated(false);
    setLoadingSession(false);
    localStorage.clear();
    sessionStorage.clear();
  };

  return { userInfo, isAuthenticated, loadingSession, login, logout };
}
