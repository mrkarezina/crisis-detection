const theme = {
    colors: {
        light: "#FFFFFF",
        primary: "#4FA4D7",
        primaryDark: "#4B6E84",
        dark: "#1A2B35",
        tint: "#77ABB7",
        neutral: "#738692",
        highlight: "#51D48D"
    }
}

export default theme

declare module "styled-components" {
    type Theme = typeof theme
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}
