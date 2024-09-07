import axios from 'axios';

const fetchEmotes = async (channelId) => {
  try {
    let response = await axios.get('https://7tv.io/v3/emote-sets/63584dd8848525f4dd62b143');

    let emotes = {}

    for (const i in response.data.emotes) {
      let emote = response.data.emotes[i]
      emotes[emote.name] = 'https:' + emote.data.host.url + '/2x.webp'
    }

    try {
      response = await axios.get('https://7tv.io/v3/users/twitch/' + channelId);

      if (response.data.emote_set) {
        for (const i in response.data.emote_set.emotes) {
          let emote = response.data.emote_set.emotes[i]
          emotes[emote.name] = 'https:' + emote.data.host.url + '/2x.webp'
        }
      }
    } catch (error) { }

    return emotes;
  } catch (error) {
    console.error('Error fetching 7TV emotes:', error);
    return [];
  }
};

export default fetchEmotes;
