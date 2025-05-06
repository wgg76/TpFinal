import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// 1) Importa HashRouter en lugar de BrowserRouter
import { HashRouter } from "react-router-dom";

import { SearchProvider } from "./context/SearchContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2) Usa HashRouter envolviendo toda tu app */}
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
