import { createTheme } from "@mui/material/styles";

const egTheme = (mode = "dark") =>
  createTheme({
    palette: {
      mode, // to enable dark mode--std from mui
      primary: {
        light: "#5330e0",
        main: "#1800ad",
        dark: "#00007e",
        contrastText: "#ffffff",
      },
      secondary: {
        light: "#c8ff4d",
        main: "#96ad00",
        dark: "#647d00",
        contrastText: "#000000",
      },
      error: {
        main: "#ad1700",
      },
      success: {
        main: "#96ad00",
      },
      info: {
        main: "#6e00ad",
      },
    },
    typography: {
      fontFamily: ["Roboto Mono", "monospace"].join(","),
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 500,
      },
      h4: {
        fontWeight: 500,
      },
    },
  });

export default egTheme;
