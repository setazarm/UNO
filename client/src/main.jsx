// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";
import { HashRouter } from "react-router-dom";
import Container from "./context/Container.jsx";
//axios.defaults.baseURL = "http://localhost:8000";
ReactDOM.createRoot(document.getElementById("root")).render(
    <HashRouter>
        <Container>
            <App />
        </Container>
    </HashRouter>
);
