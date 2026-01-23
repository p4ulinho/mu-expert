/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // Slate 900
                sidebar: "#1e293b",    // Slate 800
                card: "#334155",       // Slate 700
                primary: "#6366f1",    // Indigo 500
                secondary: "#475569",  // Slate 600
                accent: "#64748b",     // Slate 500
                textMain: "#f8fafc",   // Slate 50
                textMuted: "#94a3b8",  // Slate 400
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
