"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FirebaseClientProvider } from "@/firebase/client-provider";

/**
 * Providers Component
 * 
 * Orden lógico de providers:
 * 1. FirebaseClientProvider - Base de datos y autenticación (Firebase)
 * 2. NextThemesProvider - Tema visual (dark/light mode)
 * 3. TooltipProvider - Componentes UI (tooltips)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </NextThemesProvider>
    </FirebaseClientProvider>
  );
}