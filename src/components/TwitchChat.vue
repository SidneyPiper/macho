<template>
    <div class="overflow-y-auto break-words overscroll-none" ref="chat" @scroll="handleScroll">
        <TwitchMessage v-for="message in messages" :key="message.id" :msg="message.text" :tags="message.tags"
            :emotes7tv="emotes7tv" :channel="message.channel" />
        <button v-if="paused" @click.prevent="$refs.chat.scrollTo(0, $refs.chat.scrollHeight); msgCounter = 0"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 border border-black dark:border-stone-200 rounded-md px-4 py-2 bg-white dark:bg-stone-950">
            {{ msgCounter > 0 ? msgCounter + " new messages" : "Chat paused" }}
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { v4 as uuid4 } from 'uuid';
import createClient from '../services/twitchChat';
import fetchEmotes from '../services/7tvEmotes';
import TwitchMessage from './TwitchMessage.vue';

const chat = ref(null)

const messages = ref([]);
const emotes7tv = ref({})
const paused = ref(false)
const oldScroll = ref(0)

const msgCounter = ref(0)

onMounted(async () => {
    const channels = ['ohnePixel', 'Saalltyyy'];

    const client = createClient(channels);

    client.on('roomstate', async (channel, state) => {
        if (Object.keys(emotes7tv.value).length === 0) {
            emotes7tv.value = await fetchEmotes(state['room-id']);
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
    });
});

const handleScroll = () => {
    const newScroll = chat.value.scrollTop + chat.value.clientHeight

    if (newScroll < oldScroll.value) {
        paused.value = true
    } else if (newScroll >= chat.value.scrollHeight) {
        paused.value = false
        msgCounter.value = 0
    }

    oldScroll.value = newScroll
}
</script>