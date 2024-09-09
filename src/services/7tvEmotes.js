import axios from 'axios';

const fetchEmotes = async (channelId) => {
    let emotes = {}

    await axios.get('https://7tv.io/v3/emote-sets/63584dd8848525f4dd62b143')
        .then((response) => {
            response.data.emotes.forEach(emote => {
                emotes[emote.name] = emote.data.host.url
            })
        }).catch(error => {
            console.log(error);
        })

    await axios.get('https://7tv.io/v3/users/twitch/' + channelId)
        .then((response) => {
            if (response.data.emote_set) {
                response.data.emote_set.emotes.forEach(emote => {
                    emotes[emote.name] = emote.data.host.url
                })
            }
        }).catch(error => {
            console.log(error);
        })

    return emotes;
};

export default fetchEmotes;
