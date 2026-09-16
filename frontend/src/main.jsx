import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import AuthProvider from "@/context/AuthContext";
import queryClient from "@/lib/queryClient";
import "./index.css";
const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme =
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
document.documentElement.classList.toggle("dark", initialTheme === "dark");
document.documentElement.style.colorScheme = initialTheme;
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {" "}
    <QueryClientProvider client={queryClient}>
      {" "}
      <AuthProvider>
        {" "}
        <App />{" "}
      </AuthProvider>{" "}
    </QueryClientProvider>{" "}
  </StrictMode>,
);
