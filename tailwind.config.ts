import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBlueColor: "#2b546d",
        customBlueLighterColor: "#5087a8",
        darkerCustomColor: "#1d1e22",
        darkBlue: "#243948",
        darkModeCustomBg: "#0a0a0a"
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        workSans: ["Work Sans", "serif"],
        hostGrotesk: ["Host Grotesk", "sans-serif"]
      },
      screens: {
        "mobile-height": { raw: "(max-height: 600px)" },
        "mobile-width": { raw: "(max-width: 465px)" }
      }
    }
  },
  plugins: []
} satisfies Config;
