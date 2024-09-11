<template>
  <div class="py-2 border-b border-black dark:border-stone-200 flex flex-col md:flex-row gap-3 w-full justify-between">
    <div class="flex gap-3 items-center">
      <div class="flex gap-1 shrink-0">
        <Logo class="w-8 h-8"/>
        <p class="font-semibold text-2xl">Macho</p>
      </div>
      <div class="flex grow min-w-0 dark:bg-stone-900 border border-black rounded-md pl-4">
        <input v-model="channel" type="text" placeholder="New channel"
               class="grow min-w-0 bg-transparent focus:outline-none"/>
        <button @click="hande_add_button" class="py-2 px-4 hover:bg-stone-800 rounded-md transition-all shrink-0">
          <PlusIcon class="w-6 h-6"/>
        </button>
      </div>
      <button @click="menu = !menu" class="p-2 hover:bg-stone-800 rounded-md transition-all shrink-0 md:hidden">
        <Bars3Icon class="w-6 h-6"/>
      </button>
    </div>
    <div v-show="menu" class="flex flex-col md:flex-row gap-2 justify-center">
      <button v-for="c in active_channels" :key="c"
              class="flex justify-center dark:bg-stone-900 border border-black rounded-md py-2 px-4 hover:bg-red-600 transition-all"
              @click="leave_channel(c)">
        {{ c }}
      </button>
    </div>
    <div v-show="menu" class="flex justify-center">
      <button v-if="themeStore.isDarkMode()" @click="themeStore.setLightMode()"
              class="py-2 px-6 hover:bg-stone-800 rounded-md transition-all shrink-0">
        <SunIcon class="w-6 h-6"/>
      </button>
      <button v-else @click="themeStore.setDarkMode()"
              class="py-2 px-6 hover:bg-stone-800 rounded-md transition-all shrink-0">
        <MoonIcon class="w-6 h-6"/>
      </button>
    </div>
  </div>
</template>

<script setup>
import {ChatBubbleLeftRightIcon as Logo, PlusIcon, Bars3Icon} from '@heroicons/vue/24/solid'
import {MoonIcon, SunIcon} from '@heroicons/vue/24/outline'
import {useThemeStore} from "@/stores/theme.js";
import {useAppStore} from "@/stores/app.js";
import {computed, ref} from "vue";

const props = defineProps(['client'])

const themeStore = useThemeStore();
const appStore = useAppStore()

const menu = ref(true)

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