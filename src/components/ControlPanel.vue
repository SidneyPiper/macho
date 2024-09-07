<template>
    <div class="py-2 border-b border-black dark:border-stone-200 flex justify-between">
        <div class="flex gap-1">
            <Logo class="w-6 h-6" />
            <p class="font-semibold">Macho</p>
        </div>
        <div>
            <SunIcon v-if="themeStore.isDarkMode()" class="w-6 h-6" @click="themeStore.setLightMode()" />
            <MoonIcon v-else class="w-6 h-6" @click="themeStore.setDarkMode()" />
        </div>
    </div>
</template>

<script setup>
import { ChatBubbleLeftRightIcon as Logo } from '@heroicons/vue/24/solid'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { themeStore } from '@/services/theme';
</script>