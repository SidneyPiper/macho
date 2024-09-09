<template>
  <div>
    <div>
      <input v-model="new_channel" type="text" placeholder="New channel"/>
      <button @click="add_new_channel">Add</button>
    </div>
    <div ref="chat" class="overflow-y-auto break-words overscroll-none" @scroll="handleScroll">
      <TwitchMessage v-for="message in messages" :key="message.id" :text="message.text" :tags="message.tags"
                     :channel="message.channel"/>
      <button v-if="paused" @click.prevent="$refs.chat.scrollTo(0, $refs.chat.scrollHeight); msgCounter = 0"
              class="absolute bottom-4 left-1/2 -translate-x-1/2 border border-black dark:border-stone-200 rounded-md px-4 py-2 bg-white dark:bg-stone-950">
        {{ msgCounter > 0 ? msgCounter + " new messages" : "Chat paused" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, onBeforeMount, useTemplateRef, watch} from 'vue';
import {v4 as uuid4} from 'uuid';
import fetchEmotes from '../services/7tvEmotes';
import TwitchMessage from './TwitchMessage.vue';
import {useAppStore} from "@/stores/app.js";
import tmi from "tmi.js";

const appStore = useAppStore();
const chat = useTemplateRef('chat')

const messages = ref([]);
const paused = ref(false)
const msgCounter = ref(0)

const new_channel = ref()
const channels = ref([])
let client = new tmi.Client({channels: channels.value})
client.connect();


const add_new_channel = () => {
  channels.value.push(new_channel.value);

  console.log('Test')
  client.disconnect()

  client = new tmi.Client({channels: channels.value})
  client.connect();

  console.log('Joined ', channels.value)

  client.on('roomstate', async (channel, state) => {
    if (Object.keys(appStore.seven_tv_emotes).length === 0) {
      appStore.set_seven_tv_emotes(await fetchEmotes(state['room-id']));
    }
  })

  client.on('message', (channel, tags, message, self) => {
    messages.value.push({
      id: uuid4(),
      tags: tags,
      text: message,
      channel: channel
    });

    if (chat.value) {
      if (!paused.value) {
        chat.value.scrollTo(0, chat.value.scrollHeight);
        msgCounter.value = 0
      } else {
        msgCounter.value += 1
      }
    }
  })
}

let oldScroll = 0
const handleScroll = () => {
  const newScroll = chat.value.scrollTop + chat.value.clientHeight

  if (newScroll < oldScroll) {
    paused.value = true
  } else if (newScroll >= chat.value.scrollHeight) {
    paused.value = false
    msgCounter.value = 0
  }

  oldScroll = newScroll
}
</script>