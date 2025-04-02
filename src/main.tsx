import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <StrictMode>
            <ThemeProvider>
              <AppWrapper>
                  <AuthProvider>
                      <App />
                  </AuthProvider>
              </AppWrapper>
            </ThemeProvider>
  </StrictMode>,
    </QueryClientProvider>

);
