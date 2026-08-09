import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./styles/index.css";

const redirect = sessionStorage.redirect;

if (redirect) {
  delete sessionStorage.redirect;

  window.history.replaceState(
    null,
    "",
    redirect
  );
}

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter basename="/portfolio">
      <App />
    </BrowserRouter>
  </StrictMode>
);

