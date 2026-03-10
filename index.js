import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles"; // standard way to import theme
import egTheme from "./UI/Theme"; // my created theme
import { MyCartContextProvider } from "./Context/Context";
import { SessionProvider } from "./Context/sessionContext";
import { CssBaseline } from "@mui/material";
import useMode from "./Hooks/useMode";
import { useState } from "react";

function Root() {
  const [mode, setMode] = useState();
  const theme = egTheme(mode);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SessionProvider>
        <MyCartContextProvider>
          <App mode={mode} toggleMode={toggleMode} />
        </MyCartContextProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
