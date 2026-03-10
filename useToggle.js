import { useState } from "react";

// from MUI -  for toggle option used for shopping drawer
function useToggle(initialToggle = false) {
  const [open, setOpen] = useState(initialToggle);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return {
    open,
    toggleDrawer,
  };
}
export default useToggle;
