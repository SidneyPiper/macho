/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'], // add the font family here
            },
        },
    },
    plugins: [],
}

