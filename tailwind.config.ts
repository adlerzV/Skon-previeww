import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#15171e",
          surface: "#23252b",
          surface_hover: "#313339",
          surface_m: "#88898c",
          menu: "#1a1c23",
          zard: "#ffb400",
          sabz: "#75dd04",
          blue: "#0074e0",
          m_khonsa: "#c2c2c4",
          active: "#f8f5f9",
          white: "#ffffff",
        },
      },
      fontFamily: {
        sans: ['var(--font-yekan)', 'sans-serif'],
      },
      spacing: {
        '5px': '5px',
        '10px': '10px',
      },
      maxWidth: {
        'site': '1600px',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;