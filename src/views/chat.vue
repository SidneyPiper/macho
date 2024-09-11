<template>
  <div id="app" class="flex h-dvh w-dvw flex-col items-stretch dark:bg-stone-950 dark:text-stone-200 font-montserrat">
    <ControlPanel class="fixed px-2 bg-white dark:bg-stone-950" :client="client"/>
    <TwitchChat ref="twitch_chat" class="grow p-4 pb-8 pt-20" :messages="messages"/>
  </div>
</template>

<script setup>
import TwitchChat from '@/components/TwitchChat.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import {nextTick, onBeforeMount, ref, useTemplateRef} from "vue";
import tmi from "tmi.js";
import {v4 as uuid4} from "uuid";
import {useAppStore} from "@/stores/app.js";

const appStore = useAppStore();
const twitch_chat = useTemplateRef('twitch_chat')

const messages = ref([])

let client = new tmi.Client()

onBeforeMount(async () => {
  await appStore.fetch_seven_tv_global_emotes()
  await appStore.fetch_global_badges()

  await client.connect()

  client.on('message', (channel, tags, message, self) => {
    messages.value.push({
      id: uuid4(),
      tags: tags,
      text: message,
      channel: channel
    });

    nextTick(() => {
      if (twitch_chat) {
        twitch_chat.value.scroll()
      }
    })
  })
})
</script>
