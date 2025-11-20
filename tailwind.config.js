/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				WalnutDark: "#2E1F1B",
				WalnutLight: "#5E4B43",
				dark: "#2e1f1b",
				medium: "#e5d4b8",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}
