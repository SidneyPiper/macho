<template>
  <p>
    <span class="inline-block">
      <img class="h-5 w-5 inline-block rounded-full" :src="appStore.channels[channel].img" :alt="channel">
    </span>
    <span class="inline-block pl-1" v-for="(value, key) in tags.badges" :key="key">
      <img v-if="key === 'subscriber'" class="h-5 w-5 inline-block" :src="appStore.subscriber_badges[channel][value]"
           :alt="key">
      <img v-else class="h-5 w-5 inline-block" :src="appStore.badges[key][value]" :alt="key">
    </span>
    <span class="font-semibold inline-block pl-1" :style="{ color: tags.color }">{{ tags['display-name'] }}:</span>
    <span class="inline pl-1" v-html="msg_with_emotes(text)"></span>
  </p>
</template>

<script setup>
import {useAppStore} from "@/stores/app.js";

const appStore = useAppStore();
const props = defineProps(['text', 'tags', 'channel'])

const msg_with_emotes = (text) => {
  let msg = text.split(' ')
  let index = 0
  let emotes = {}

  for (const emote_id in props.tags.emotes) {
    for (const range in props.tags.emotes[emote_id]) {
      emotes[Number(props.tags.emotes[emote_id][range].split('-')[0])] = emote_id
    }
  }

  return msg.map((word) => {
        let tmp_index = index
        index += word.length + 1

        if (tmp_index in emotes) {
          return `<img class="h-5 inline-block object-contain" src="https://static-cdn.jtvnw.net/emoticons/v2/${emotes[tmp_index]}/default/light/2.0" alt="${emotes[tmp_index]}"/>`
        } else if (appStore.seven_tv_emotes['global'] && word in appStore.seven_tv_emotes['global']) {
          return `<img class="h-8 inline-block object-contain" src="https:${appStore.seven_tv_emotes['global'][word]}/2x.webp" alt="${word}" />`
        } else if (appStore.seven_tv_emotes[props.channel] && word in appStore.seven_tv_emotes[props.channel]) {
          return `<img class="h-8 inline-block object-contain" src="https:${appStore.seven_tv_emotes[props.channel][word]}/2x.webp" alt="${word}" />`
        } else {
          return word
        }
      }
  ).join(' ')
}


</script>
