import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import AuthContextProvider from "./hooks/AuthContextProvider";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

// Set API URL
// axios.defaults.baseURL = `http://${window.location.hostname}:${import.meta.env.VITE_API_URL}/api`;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);
