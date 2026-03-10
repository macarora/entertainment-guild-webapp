import { useState } from "react";

// based on toggleDrawer to handle dark and light mode-- this is a dedication to jacqueline -- my graduation gift
function useMode(initialMode = false) {
  const [mode, setMode] = useState(initialMode);

  const toggleMode = (newMode) => {
    console.log("Toggling mode to:", newMode);
    setMode(newMode);
  };

  return {
    mode,
    toggleMode,
  };
}
export default useMode;
