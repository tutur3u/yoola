"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type LightboxContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const LightboxContext = createContext<LightboxContextType | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <LightboxContext.Provider value={{ isOpen, open, close }}>{children}</LightboxContext.Provider>
  );
}

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}
