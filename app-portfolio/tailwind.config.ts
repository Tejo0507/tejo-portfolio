import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        WalnutDark: "#2E1F1B",
        WalnutLight: "#5E4B43",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config

