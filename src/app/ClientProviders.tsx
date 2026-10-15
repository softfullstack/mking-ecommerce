"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Theme } from "../Theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloatingButton from "../components/WhatsAppFloatingButton";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";
import useUIStore from "../store/UIStore";
import useAuthStore from "../store/AuthStore";
import useCartStore from "../store/CartStore";
import { GetMeService } from "../services/MKing.service";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const { currentProductName } = useUIStore();
  const { login, logout } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Cargar sesión y carrito guardados en localStorage (skipHydration en los stores)
    useAuthStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
    setMounted(true);
    const checkAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      try {
        const response = await GetMeService();
        login(response.data.user);
        fetchCart();
      } catch (error) {
        console.error("Session expired or invalid");
        localStorage.removeItem("token");
        logout();
      }
    };

    checkAuth();
  }, [login, logout, fetchCart]);

  return (
    <HelmetProvider>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <ToastContainer />
      <Navbar />
      <Box sx={{ height: { xs: 56, sm: 64 } }} />
      {children}
      <Footer />
      {mounted && (
        <WhatsAppFloatingButton phoneNumber="523351146348" productName={currentProductName} />
      )}
    </ThemeProvider>
    </HelmetProvider>
  );
}
