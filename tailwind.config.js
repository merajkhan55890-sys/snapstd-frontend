/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            colors: {
                'stitch-bg': '#f0f2f5',
                'stitch-card': '#ffffff',
                'stitch-blue': '#1a73e8',
                'stitch-text': '#202124',
                'stitch-subtext': '#5f6368',
            }
        },
    },
    plugins: [],
}
