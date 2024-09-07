<template>
    <p>
        <span class="inline-block">{{ channel }}</span>
        <span class="inline-block pl-1" v-for="(value, key) in tags.badges" :key="key">
            <img class="h-5 w-5 inline-block" :src="badges[key].find(x => x.id == value).image_url_2x">
        </span>
        <span class="font-semibold inline-block pl-1" :style="{ color: tags.color }">{{ tags['display-name'] }}:</span>
        <span class="inline pl-1" v-html="msgWith7tvEmotes(msgWithEmotes(msg))"></span>
    </p>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import badges from '../assets/badges.json'

const props = defineProps(['msg', 'tags', 'emotes7tv', 'channel'])

onBeforeMount(() => {
    if (props.tags.badges) {
        if ('subscriber' in props.tags.badges) {
            props.tags.badges['subscriber'] = '1'
        }
    }
})

const msgWithEmotes = (text) => {
    let msg = text;
    let offset = 0;
    let emotes = [];

    for (const key in props.tags.emotes) {
        for (const index in props.tags.emotes[key]) {
            let [start, end] = props.tags.emotes[key][index].split('-').map(Number);
            emotes.push([start, end, key])
        }
    }

    emotes.sort((a, b) => a[0] - b[0]);

    for (const [start, end, key] of emotes) {
        const url = `<img class="h-5 inline-block object-contain" src="https://static-cdn.jtvnw.net/emoticons/v2/${key}/default/light/2.0" />`;
        msg = msg.replaceBetween(start + offset, end + offset, url);
        offset += url.length - (end - start + 1);
    }

    return msg;
};

const msgWith7tvEmotes = (text) => {
    let msg = text.split(' ')

    for (const i in msg) {
        let word = msg[i];
        if (word in props.emotes7tv) {
            msg[i] = `<img class="h-8 inline-block object-contain" src="${props.emotes7tv[word]}" />`
        }
    }

    return msg.join(' ')
}


String.prototype.replaceBetween = function (start, end, x) {
    return this.substring(0, start) + x + this.substring(end + 1)
};


</script>
