<template>
  <div
      class="py-2 border-b border-black dark:border-stone-200 flex flex-col md:flex-row gap-3 w-full justify-between">
    <div class="flex gap-3 items-center">
      <div class="flex gap-1 shrink-0">
        <Logo class="w-8 h-8"/>
        <p class="font-semibold text-2xl">Macho</p>
      </div>
      <div class="flex grow min-w-0 dark:bg-stone-900 bg-gray-200 rounded-md pl-4">
        <input v-model="channel" type="text" placeholder="New channel"
               class="grow min-w-0 bg-transparent focus:outline-none"
               @keydown.enter="handle_add_button"/>
        <button @click="handle_add_button"
                class="py-2 px-4 dark:hover:bg-stone-800 hover:bg-gray-300 rounded-md transition-all shrink-0">
          <PlusIcon class="w-6 h-6"/>
        </button>
      </div>
      <button @click="mobile_menu = !mobile_menu"
              class="p-2 dark:hover:bg-stone-800 hover:bg-gray-200 rounded-md transition-all shrink-0 md:hidden">
        <Bars3Icon class="w-6 h-6"/>
      </button>
    </div>
    <div :class="mobile_menu ? 'flex': 'hidden'"
         class="md:flex flex-col md:flex-row gap-2 overflow-x-scroll">
      <button v-for="c in active_channels" :key="c"
              class="flex justify-center dark:bg-stone-900 bg-gray-200 rounded-md py-2 px-4 hover:bg-red-600 hover:text-white transition-all"
              @click="leave_channel(c)">
        {{ c }}
      </button>
    </div>
    <div :class="mobile_menu ? 'flex': 'hidden'" class="md:flex justify-center items-center relative">
      <IconButton @click="profile_dropdown = !profile_dropdown" class="hidden md:flex w-24">
        <img class="h-7 w-7 rounded-full" :src="user.img" :alt="user.name">
      </IconButton>
      <IconButton class="flex md:hidden">
        <img class="h-7 w-7 rounded-full" :src="user.img" :alt="user.name">
      </IconButton>
      <div :class="profile_dropdown ? 'md:flex': 'md:hidden'"
           class="flex md:items-center md:p-4 md:flex-col md:absolute md:top-14 md:gap-3 dark:md:bg-stone-900 md:bg-gray-200 md:rounded-md">
        <IconButton v-if="themeStore.isDarkMode()" @click="themeStore.setLightMode()">
          <SunIcon class="w-6 h-6"/>
        </IconButton>
        <IconButton v-else @click="themeStore.setDarkMode()">
          <MoonIcon class="w-6 h-6"/>
        </IconButton>
        <IconButton @click="logout(); $router.push('/')">
          <ArrowRightEndOnRectangleIcon class="w-6 h-6"/>
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChatBubbleLeftRightIcon as Logo,
  PlusIcon,
  Bars3Icon,
  ArrowRightEndOnRectangleIcon
} from '@heroicons/vue/24/solid'
import {MoonIcon, SunIcon} from '@heroicons/vue/24/outline'
import {useThemeStore} from "@/stores/theme.js";
import {useAppStore} from "@/stores/app.js";
import {computed, onBeforeMount, onBeforeUnmount, onMounted, ref} from "vue";
import axios from "axios";
import {get_token, logout} from "@/stores/token.js";
import IconButton from "@/components/IconButton.vue";

const props = defineProps(['client'])

const themeStore = useThemeStore();
const appStore = useAppStore()

const mobile_menu = ref(false)
const profile_dropdown = ref(false)


const user = ref({})

onBeforeMount(async () => {
  try {
    const response = await axios.get(`https://api.twitch.tv/helix/users`, {
      headers: {
        'Authorization': `Bearer ${get_token()}`,
        'Client-Id': 'oe33kkiax4rchm0eelzlbradrr8zur'
      }
    })

    user.value = {
      name: response.data.data[0].display_name,
      img: response.data.data[0].profile_image_url,
    }
  } catch (error) {

  }
})

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

const handle_add_button = async () => {
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