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
        document.querySelector("meta[name='theme-color']").setAttribute('content', '#0c0a09')
    }

    function setLightMode() {
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
        dark.value = false
        document.querySelector("meta[name='theme-color']").setAttribute('content', '#ffffff')
    }

    return {isDarkMode, setDarkMode, setLightMode}
})