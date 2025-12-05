/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#ec4899', // Pink-500
                secondary: '#db2777', // Pink-600
                dark: '#1f2937', // Gray-800
            }
        },
    },
    plugins: [],
}
