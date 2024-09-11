<template>
  <div ref="chat_container" class="overflow-y-auto break-words overscroll-none text-lg" @scroll="handleScroll">
    <TwitchMessage v-for="message in messages" :key="message.id" :text="message.text" :tags="message.tags"
                   :channel="message.channel" class="min-h-8"/>
    <button v-if="paused"
            @click="handleClick"
            @mouseenter="play_button = true"
            @mouseleave="play_button = false"
            class="absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 dark:bg-stone-900 bg-gray-200 rounded-md px-4 py-2">
      <PlayIcon v-if="play_button" class="w-10 h-10"/>
      <PauseIcon v-else class="w-10 h-10"/>
    </button>
  </div>
</template>

<script setup>
import {useTemplateRef, ref} from 'vue';
import TwitchMessage from './TwitchMessage.vue';
import {PauseIcon, PlayIcon} from '@heroicons/vue/24/solid'

defineProps(['messages'])

const chat = useTemplateRef('chat_container')
const paused = ref(false)

const play_button = ref(false)

const scroll = () => {
  if (!paused.value) {
    chat.value.scrollTo({left: 0, top: chat.value.scrollHeight, behavior: 'smooth'});
  }
}

let oldScroll = 0
const handleScroll = () => {
  const newScroll = chat.value.scrollTop + chat.value.clientHeight

  if (newScroll < oldScroll) {
    paused.value = true
  } else if (newScroll >= chat.value.scrollHeight) {
    paused.value = false
  }

  oldScroll = newScroll
}

const handleClick = () => {
  chat.value.scrollTo({left: 0, top: chat.value.scrollHeight, behavior: 'smooth'})
  paused.value = false
  play_button.value = false
}

defineExpose({scroll})
</script>