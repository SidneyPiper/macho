import {defineStore} from 'pinia'
import {ref} from "vue";
import axios from "axios";
import {get_token} from "@/stores/token.js";

export const useAppStore = defineStore('app', () => {
    const seven_tv_emotes = ref({})
    const channels = ref({})
    const badges = ref({})
    const subscriber_badges = ref({})

    async function fetch_seven_tv_global_emotes() {
        try {
            const response = await axios.get('https://7tv.io/v3/emote-sets/63584dd8848525f4dd62b143')
            let emotes = {}

            response.data.emotes.forEach(emote => {
                emotes[emote.name] = emote.data.host.url
            })

            seven_tv_emotes.value['global'] = emotes
        } catch (error) {
        }
    }

    async function fetch_seven_tv_channel_emotes(channel, id) {
        try {
            const response = await axios.get('https://7tv.io/v3/users/twitch/' + id)
            let emotes = {}

            if (response.data.emote_set) {
                response.data.emote_set.emotes.forEach(emote => {
                    emotes[emote.name] = emote.data.host.url
                })
            }

            seven_tv_emotes.value[channel] = emotes
        } catch (error) {
        }
    }

    async function add_channel(channel) {
        if (Object.keys(channels.value).includes('#' + channel.toLowerCase())) {
            channels.value['#' + channel.toLowerCase()].joined = true
            return true
        }

        try {
            const response = await axios.get(`https://api.twitch.tv/helix/users?login=${channel}`, {
                headers: {
                    'Authorization': `Bearer ${get_token()}`,
                    'Client-Id': 'oe33kkiax4rchm0eelzlbradrr8zur'
                }
            })

            const user = response.data.data[0]

            channels.value['#' + user.display_name.toLowerCase()] = {
                name: user.display_name,
                img: user.profile_image_url,
                id: user.id,
                joined: true
            }

            await fetch_seven_tv_channel_emotes('#' + user.display_name.toLowerCase(), user.id);
            await fetch_channel_badges('#' + user.display_name.toLowerCase(), user.id)

            return true
        } catch (error) {
            return false
        }
    }

    function remove_channel(channel) {
        if (Object.keys(channels.value).includes('#' + channel.toLowerCase())) {
            channels.value['#' + channel.toLowerCase()].joined = false
            return true
        }
        return false
    }

    async function fetch_global_badges() {
        try {
            const response = await axios.get('https://api.twitch.tv/helix/chat/badges/global', {
                headers: {
                    'Authorization': `Bearer ${get_token()}`,
                    'Client-Id': 'oe33kkiax4rchm0eelzlbradrr8zur'
                }
            })


            response.data.data.forEach((badge) => {
                badges.value[badge.set_id] = {}
                badge.versions.forEach(version => {
                    badges.value[badge.set_id][version.id] = version.image_url_2x
                })
            })
        } catch (error) {
        }
    }

    async function fetch_channel_badges(channel, id) {
        try {
            const response = await axios.get(`https://api.twitch.tv/helix/chat/badges?broadcaster_id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${get_token()}`,
                    'Client-Id': 'oe33kkiax4rchm0eelzlbradrr8zur'
                }
            })

            subscriber_badges.value[channel] = {}
            response.data.data.forEach(badge => {
                if (badge.set_id === 'subscriber') {
                    badge.versions.forEach(version => {
                        subscriber_badges.value[channel][version.id] = version.image_url_2x
                    })
                }
            })
        } catch (error) {
        }

    }

    return {
        seven_tv_emotes,
        channels,
        badges,
        subscriber_badges,
        fetch_seven_tv_global_emotes,
        fetch_seven_tv_channel_emotes,
        add_channel,
        remove_channel,
        fetch_global_badges,
        fetch_channel_badges
    }
})