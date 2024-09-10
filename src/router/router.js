import {createWebHistory, createRouter} from 'vue-router'

import index from '@/views/home.vue'
import chat from '@/views/chat.vue'
import {get_token, is_token_valid} from "@/stores/token.js";

const routes = [
    {path: '/', component: index},
    {path: '/chat', component: chat},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const old_access_token = get_token();

    if (old_access_token) {
        const is_valid = await is_token_valid();
        if (is_valid) {
            return to.path !== '/chat' ? next('/chat') : next();
        } else {
            return to.path !== '/' ? next('/') : next();
        }
    } else {
        return to.path !== '/' ? next('/') : next();
    }
});

export default router