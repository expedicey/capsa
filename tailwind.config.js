/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'card-red': '#ef4444',
                'card-black': '#1e293b',
            },
        },
    },
    plugins: [],
}
