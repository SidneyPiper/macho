<template>
  <div class="py-2 border-b border-black dark:border-stone-200 flex justify-between items-center">
    <div class="flex items-center gap-8">
      <div class="flex gap-1">
        <Logo class="w-8 h-8"/>
        <p class="font-semibold text-2xl">Macho</p>
      </div>
      <div class="flex dark:bg-stone-900 border border-black rounded-md pl-4">
        <input v-model="channel" type="text" placeholder="New channel" class="bg-transparent focus:outline-none"/>
        <button @click="hande_add_button" class="py-2 px-4 hover:bg-stone-800 rounded-md transition-all">
          <PlusIcon class="w-6 h-6"/>
        </button>
      </div>
    </div>
    <div class="flex gap-2">
      <button v-for="c in active_channels" :key="c"
              class="flex dark:bg-stone-900 border border-black rounded-md py-1 px-4 hover:bg-red-600 transition-all"
              @click="leave_channel(c)">
        {{ c }}
      </button>
    </div>
    <div>
      <SunIcon v-if="themeStore.isDarkMode()" class="w-6 h-6" @click="themeStore.setLightMode()"/>
      <MoonIcon v-else class="w-6 h-6" @click="themeStore.setDarkMode()"/>
    </div>
  </div>
</template>

<script setup>
import {ChatBubbleLeftRightIcon as Logo, PlusIcon, XCircleIcon} from '@heroicons/vue/24/solid'
import {MoonIcon, SunIcon} from '@heroicons/vue/24/outline'
import {useThemeStore} from "@/stores/theme.js";
import {useAppStore} from "@/stores/app.js";
import {computed, ref} from "vue";

const props = defineProps(['client'])

const themeStore = useThemeStore();
const appStore = useAppStore()

const channel = ref('')
const active_channels = computed(() => {
  return Object.entries(appStore.channels).map(x => x[1]).filter(x => x.joined === true).map(x => x.name)
})

const add_channel = async (c) => {
  const added = await appStore.add_channel(c)
  if (added) {
    props.client.join(c)
  }
}

const hande_add_button = async () => {
  const twitch_regex = /^[a-zA-Z0-9][a-zA-Z0-9_]{2,24}$/
  if (twitch_regex.test(channel.value)) {
    let tmp = channel.value
    channel.value = ''
    await add_channel(tmp)
  }
}

const leave_channel = (channel) => {
  const removed = appStore.remove_channel(channel)
  if (removed) {
    props.client.leave(channel)
  }
}

</script>