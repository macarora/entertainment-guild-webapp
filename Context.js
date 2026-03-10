import { createContext, useContext, useState } from "react";

//using context to hold the state fo the cart
const MyCartContext = createContext();

export const useMyCartContext = () => {
  return useContext(MyCartContext);
};

export const MyCartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const clearCart = () => {
    setCart([]);
  }; // clearCart function defined for later use in checkout

  const allCart = {
    cart,
    setCart,
    clearCart,
  };
  return (
    <MyCartContext.Provider value={allCart}>{children}</MyCartContext.Provider>
  );
};
