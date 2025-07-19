import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WagmiProvider } from "wagmi";
import App from "./App.tsx";
import { wagmiConfig } from "@/config/wagmiConfig.ts";
import { SolanaProvider } from "@/providers/solanaProvider.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <SolanaProvider>
          <App />
        </SolanaProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </StrictMode>
);
