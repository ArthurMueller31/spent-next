import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBlueColor: "#2b546d",
        customBlueLighterColor: "#5087a8",
        darkerCustomColor: "#1d1e22",
        darkBlue: "#243948"
      },
      fontFamily: {
        "raleway": ["Raleway", "sans-serif"],
        "workSans": ["Work Sans", "serif"],
        "hostGrotesk": ["Host Grotesk", "sans-serif"]
      }
    },
  },
  plugins: [],
} satisfies Config;
