import { createTheme } from "@mui/material/styles"

export const Theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff0000",
            light: "#ff3333",
            dark: "#cc0000",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#000000",
            light: "#333333",
            dark: "#000000",
            contrastText: "#ffffff",
        },
        background: {
            default: "#1a1a1a", // Cambiado a un gris muy oscuro
            paper: "#242424", // Cambiado a un gris oscuro para elementos de papel
        },
        text: {
            primary: "#ffffff",
            secondary: "#b3b3b3",
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            fontWeight: 600,
            textTransform: "none",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    padding: "10px 20px",
                },
                contained: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                },
            },
        },
    },
})
