import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import App from "./App";
import AuthProvider from "@/context/AuthContextProvider";
import queryClient from "@/lib/queryClient";

import "./index.css";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initialTheme = getInitialTheme();

document.documentElement.classList.toggle("dark", initialTheme === "dark");

document.documentElement.style.colorScheme = initialTheme;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={4000}
          visibleToasts={4}
          expand={false}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
