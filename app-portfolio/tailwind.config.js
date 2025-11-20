/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				WalnutDark: "#2E1F1B",
				WalnutLight: "#5E4B43",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}
