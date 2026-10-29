import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          basic: "rgb(var(--color_basic))",
          basic_dim: "rgb(var(--color_basic-dim))",
          input: "rgb(var(--color_input))",
        },
        link: {
          link_1: "rgb(var(--color_link-1))",
          link_2: "rgb(var(--color_link-2))",
        },
        button: {
          btn_enable: "rgb(var(--color_button-enable))",
          btn_disable: "rgb(var(--color_button-disable))",
          btn_1: "rgb(var(--color_button-1))",
          btn_2: "rgb(var(--color_button-2))",
          btn_3: "rgb(var(--color_button-3))",
          btn_4: "rgb(var(--color_button-4))",
          btn_5: "rgb(var(--color_button-5))",
          btn_6: "rgb(var(--color_button-6))",
        },
        background: {
          Theme: "rgb(var(--color-bg_Theme))",
          Card_1: "rgb(var(--color-bg_Card-1))",
          Card_2: "rgb(var(--color-bg_Card-2))",
          Footer: "rgb(var(--color-bg_Footer))",
          Modal: "rgb(var(--color-bg_Modal))",
          Icon_1: "rgb(var(--color-bg_Icon-1))",
          option_1: "rgb(var(--color-bg_option-1))",
          option_2: "rgb(var(--color-bg_option-2))",
          bar_1: "rgb(var(--color-bg_bar-1))",
          bar_2: "rgb(var(--color-bg_bar-2))",
        },
        hover: {
          text: {
            1: "rgb(var(--color_text-hover-1))",
          },
          bg: {
            1: "var(--color_bg-hover-1)",
            2: "var(--color_bg-hover-2)",
            error: "var(--color_error-hover)"
          },
        },
        message: {
          error: "rgb(var(--color_error))",
        }
      },
      fontFamily: {
        Poppins: ["var(--font-Poppins)"],
        Josefin: ["var(--font-Josefin)"],
        Newsreader: ["var(--font-Newsreader)"],
        ArchivoBlack: ["var(--font-ArchivoBlack)"]
      },
      screens: {
        "800px": "800px",
        "400px": "400px",
        "1000px": "1000px",
        "1100px": "1100px",
        "1200px": "1200px",
        "1300px": "1300px",
        "1400px": "1400px",
        "1500px": "1500px"
      }
    },
  },
  plugins: [],
} satisfies Config;
