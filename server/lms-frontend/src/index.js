import React from "react";
import ReactDOM from "react-dom/client"; 
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./index.css"; // Import custom CSS

// Select the root element
const rootElement = document.getElementById("root");

// Create a root with ReactDOM.createRoot
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  </React.StrictMode>
);
