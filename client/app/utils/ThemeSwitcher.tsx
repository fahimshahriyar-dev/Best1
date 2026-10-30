"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { BiSolidSun, BiSolidMoon } from "react-icons/bi";

const THEME_COOKIE = "theme";
const THEME_CHANGE_EVENT = "app-theme-change";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;
const THEME_ANIMATION_DURATION = 1000;

export type Theme = "light" | "dark";

const isTheme = (value: string | null | undefined): value is Theme =>
  value === "light" || value === "dark";

export const getStoredTheme = (): Theme | null => {
  if (typeof document === "undefined") return null;

  const themeCookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${THEME_COOKIE}=`));

  const value = themeCookie?.split("=")[1];
  return isTheme(value) ? value : null;
};

export const getSystemTheme = (): Theme => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const getCurrentTheme = (): Theme => {
  if (typeof document !== "undefined") {
    const attribute = document.documentElement.getAttribute("data-theme");
    if (isTheme(attribute)) return attribute;
  }

  return getStoredTheme() ?? getSystemTheme();
};

let transitionResetFrame: number | null = null;

export const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  root.classList.add("theme-switching");
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  window.dispatchEvent(
    new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme })
  );

  if (transitionResetFrame !== null) {
    cancelAnimationFrame(transitionResetFrame);
  }

  transitionResetFrame = requestAnimationFrame(() => {
    transitionResetFrame = requestAnimationFrame(() => {
      root.classList.remove("theme-switching");
      transitionResetFrame = null;
    });
  });
};

export const saveTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;

  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
};

export const setTheme = (theme: Theme) => {
  applyTheme(theme);
  saveTheme(theme);
};

export const ThemeSwitcher = ({ className = "" }) => {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingThemeRef = useRef<Theme | null>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    setMounted(true);

    const initialTheme = getCurrentTheme();
    applyTheme(initialTheme);
    setThemeState(initialTheme);

    const syncStoredTheme = () => {
      const storedTheme = getStoredTheme() ?? getSystemTheme();
      if (storedTheme !== getCurrentTheme()) applyTheme(storedTheme);
      setThemeState(storedTheme);
    };
    const handleThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      setThemeState(isTheme(nextTheme) ? nextTheme : getCurrentTheme());
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener("focus", syncStoredTheme);
    window.addEventListener("storage", syncStoredTheme);

    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
      window.removeEventListener("focus", syncStoredTheme);
      window.removeEventListener("storage", syncStoredTheme);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }

      if (pendingThemeRef.current) {
        applyTheme(pendingThemeRef.current);
        pendingThemeRef.current = null;
      }

      isAnimating.current = false;
    };
  }, []);

  const handleThemeChange = (event: MouseEvent<HTMLButtonElement>) => {
    if (isAnimating.current) return;

    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    const animationElement = animationRef.current;

    saveTheme(nextTheme);

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!animationElement || prefersReducedMotion) {
      applyTheme(nextTheme);
      setThemeState(nextTheme);
      return;
    }

    isAnimating.current = true;
    pendingThemeRef.current = nextTheme;

    const rect = event.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    animationElement.style.transition = "none";
    animationElement.classList.remove("active");
    animationElement.style.top = `${originY}px`;
    animationElement.style.left = `${originX}px`;
    animationElement.style.backgroundColor =
      nextTheme === "dark" ? "#0F131D" : "#D1D1D1";

    void animationElement.offsetWidth;

    animationElement.style.transition = "";
    animationElement.classList.add("active");

    animationTimeoutRef.current = setTimeout(() => {
      applyTheme(nextTheme);
      setThemeState(nextTheme);
      pendingThemeRef.current = null;
      animationTimeoutRef.current = null;

      animationElement.style.backgroundColor = "transparent";
      animationElement.classList.remove("active");

      isAnimating.current = false;
    }, THEME_ANIMATION_DURATION);
  };

  if (!theme) {
    return (
      <div
        className={`relative h-[25px] w-[25px] ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <>
      <button
        type="button"
        onClick={handleThemeChange}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDark}
        className={`relative flex items-center justify-center border-0 bg-transparent p-0 cursor-pointer text-text-basic transition-transform duration-200 active:scale-90 ${className}`}
      >
        {isDark ? (
          <BiSolidSun size={25} className="text-text-basic" />
        ) : (
          <BiSolidMoon size={25} className="text-text-basic" />
        )}
      </button>
      {mounted &&
        createPortal(
          <div
            ref={animationRef}
            className="dark-mode-animation"
            aria-hidden="true"
          />,
          document.body
        )}
    </>
  );
};
