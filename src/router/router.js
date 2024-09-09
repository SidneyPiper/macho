import {createWebHistory, createRouter} from 'vue-router'

import index from '@/views/home.vue'
import chat from '@/views/chat.vue'

const routes = [
    {path: '/', component: index},
    {path: '/chat', component: chat},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router