import {defineStore} from 'pinia'
import {ref} from "vue";

export const useAppStore = defineStore('app', () => {
    const token = ref('')
    const seven_tv_emotes = ref({})

    function set_seven_tv_emotes(emotes) {
        seven_tv_emotes.value = emotes
    }

    function set_token(new_token) {
        token.value = new_token
    }

    return {token, seven_tv_emotes, set_seven_tv_emotes, set_token}
})