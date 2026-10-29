"use client";

import { useState, useEffect, useRef } from "react";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";

export const ThemeSwitcher = ({ className = "" }) => {
  const [theme, setTheme] = useState<string>("defaultTheme");
  const animationRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false); // Track if animation is in progress

  // Function to apply theme
  const applyTheme = (selectedTheme: string) => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
    setTheme(selectedTheme);
  };

  // Save theme in cookies
  const saveTheme = (selectedTheme: string) => {
    document.cookie = `theme=${selectedTheme};path=/;max-age=${365 * 24 * 60 * 60}`;
  };

  // Load saved theme or system preference
  useEffect(() => {
    const match = document.cookie.match(/theme=([^;]+)/);
    const savedTheme = match ? match[1] : "light";

    // Apply initial theme
    applyTheme(savedTheme);
  }, []);

  // Handle theme change
  const handleThemeChange = () => {
    if (isAnimating.current) {
      return;
    }
    isAnimating.current = true;

    const newTheme = theme === "dark" ? "light" : "dark";

    if (animationRef.current) {
      animationRef.current.style.backgroundColor = newTheme === "dark" ? "#0F131D" : "#D1D1D1";
      animationRef.current.classList.add("active");

      // Apply theme and reset animation after the animation finishes
      setTimeout(() => {
        applyTheme(newTheme);
        saveTheme(newTheme);
        if (animationRef.current) {
          animationRef.current.style.backgroundColor = "#fff0";
          animationRef.current.classList.remove("active");
        }
        isAnimating.current = false;
      }, 1000); // Match the animation duration in CSS
    }
  };

  if (!theme) return null; // Prevent flickering

  return (
    <div className={`relative cursor-pointer ${className}`}>
      <div ref={animationRef} className="dark-mode-animation" />
      <div onClick={handleThemeChange} className="z-50">
        {theme === "light" ? <BiSolidMoon size={25} className="text-text-basic" /> : <BiSolidSun size={25} className="text-text-basic" />}
      </div>
    </div>
  );
};