/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				WalnutDark: "#8b6f47",
				WalnutLight: "#d4b896",
				dark: "#faf8f6",
				medium: "#1a1410",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}
