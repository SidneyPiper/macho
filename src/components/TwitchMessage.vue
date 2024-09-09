<template>
  <p>
    <span class="inline-block">{{ channel }}</span>
    <span class="inline-block pl-1" v-for="(value, key) in tags.badges" :key="key">
      <img class="h-5 w-5 inline-block" :src="badges[key].find(x => x.id === value).image_url_2x" :alt="key">
    </span>
    <span class="font-semibold inline-block pl-1" :style="{ color: tags.color }">{{ tags['display-name'] }}:</span>
    <span class="inline pl-1" v-html="msg_with_emotes(text)"></span>
  </p>
</template>

<script setup>
import {onBeforeMount} from 'vue';
import badges from '../assets/badges.json'
import {useAppStore} from "@/stores/app.js";

const appStore = useAppStore();
const props = defineProps(['text', 'tags', 'channel'])

onBeforeMount(() => {
  if (props.tags.badges) {
    if ('subscriber' in props.tags.badges) {
      props.tags.badges['subscriber'] = '1'
    }
  }
})

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
    } else if (word in appStore.seven_tv_emotes) {
      return `<img class="h-8 inline-block object-contain" src="https:${appStore.seven_tv_emotes[word]}/2x.webp" alt="${word}" />`
    } else {
      return word
    }
  }).join(' ')
}


</script>
