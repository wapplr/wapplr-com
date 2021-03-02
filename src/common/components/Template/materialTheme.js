export const materialTheme = function (p = {}) {

    const {mediaQuery = {}} = p;
    const prefersDarkMode = mediaQuery["(prefers-color-scheme: dark)"];

    const dark = !!(prefersDarkMode);

    return {
        palette: {
            primary: {
                main: (dark) ? "#303338" : "#ffffff",
            },
            secondary: {
                main: (dark) ? "#ffffff" : "#000000",
            },
            background: {
                paper: (dark) ? "#303338" : "#ffffff",
            },
            type: dark ? "dark" : "light",
        },
    }
}

export const materialMediaQuery = ["(prefers-color-scheme: dark)"]
