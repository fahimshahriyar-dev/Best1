'use client'
import "./globals.css";
import React, { FC, useEffect, useState } from "react";
import { Josefin_Sans, Poppins, Newsreader, Archivo_Black } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./provider";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "./components/Loader"
import { socketId } from "./utils/socket";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-Newsreader",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ArchivoBlack",
});

const themeInitScript = `
(function () {
  try {
    var match = document.cookie.match(/(?:^|;\\s*)theme=(light|dark)(?:;|$)/);
    var theme = match
      ? match[1]
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  } catch (error) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${josefin.variable} ${newsreader.variable} ${archivoBlack.variable} bg-background-Theme`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <SessionProvider>
            <Custom>
              {children}
            </Custom>
            <Toaster position="top-center" reverseOrder={false}/>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

import { useSelector } from "react-redux";
import SurveyPopup from "./components/SurveyPopup";

const Custom: FC<{children: React.ReactNode}> = ({children}) => {
  const {isLoading} = useLoadUserQuery({});
  const { user } = useSelector((state: any) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    socketId.on("connection", () => {});
  }, [])

  if (!mounted) return <Loader />;

  return (
    <>
    {
      isLoading ? <Loader/> : (
        <>
          {children}
          {user && !user.isSurveyCompleted && <SurveyPopup user={user} />}
        </>
      )
    }
    </>
  )
}