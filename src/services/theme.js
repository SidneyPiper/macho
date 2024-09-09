import {reactive} from "vue"

export const themeStore = reactive({
    dark: document.documentElement.classList.contains('dark'),
    isDarkMode() {
        return this.dark
    },
    setDarkMode() {
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')
        this.dark = true
    },
    setLightMode() {
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
        this.dark = false
    }
})