import {defineStore} from 'pinia'
import {ref} from "vue";

export const useThemeStore = defineStore('theme', () => {
    const dark = ref(document.documentElement.classList.contains('dark'))

    function isDarkMode() {
        return dark.value
    }

    function setDarkMode() {
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')
        dark.value = true
    }

    function setLightMode() {
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
        dark.value = false
    }

    return {isDarkMode, setDarkMode, setLightMode}
})