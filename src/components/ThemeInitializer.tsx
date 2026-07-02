"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const stored = localStorage.getItem("theme");

    // stored preference wins, else fall back to OS
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return null;
}
