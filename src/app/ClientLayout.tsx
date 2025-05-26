// src\app\ClientLayout.tsx

"use client";

import React, { useRef, createContext, ReactNode, useCallback } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Geist, Geist_Mono } from "next/font/google";
import "primeicons/primeicons.css";
import "@/app/globals.css";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { VideoProvider } from "@/app/providers/VideoProvider";
import { CategoryProvider } from "@/app/providers/CategoryProvider";
import { UserProvider } from "@/app/providers/UserProvider";
import { AdminProvider } from "@/app/providers/AdminProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import ThemeStyles from "@/app/components/ThemeStyles";
import { Toast, ToastMessage } from "primereact/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const ToastContext = createContext<(message: ToastMessage) => void>(
  () => {},
);

export default function ClientLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const toast = useRef<Toast>(null);
  const showToast = useCallback((options: ToastMessage) => {
    toast.current?.show(options);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider>
          <ThemeStyles />
          <PrimeReactProvider>
            <UserProvider>
              <AdminProvider>
                <Toast ref={toast} position="top-right" />
                <ToastContext.Provider value={showToast}>
                  <header>
                    <Navbar />
                  </header>
                  <main className="flex flex-1 flex-col">
                    <CategoryProvider>
                      <VideoProvider>{children}</VideoProvider>
                    </CategoryProvider>
                  </main>
                  <Footer />
                </ToastContext.Provider>
              </AdminProvider>
            </UserProvider>
          </PrimeReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
