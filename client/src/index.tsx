import * as React from "react"
import * as ReactDOM from "react-dom"
import App from "./App"
import { ThemeProvider } from "styled-components"
import theme from "./theme"
import store from "./store"
import { Provider } from "react-redux"
import "./index.css"

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById("root") as HTMLElement
)
