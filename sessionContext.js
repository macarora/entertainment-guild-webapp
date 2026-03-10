import { createContext, useContext } from "react";
import useSession from "../Hooks/useSession";

const SessionContext = createContext();

// to sahre the session stae across the app. with useSession hook each component is storing its own state which is not working for logout.
export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const session = useSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
