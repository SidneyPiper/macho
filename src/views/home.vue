<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex gap-1">
      <Logo class="w-6 h-6"/>
      <p class="font-semibold">Macho</p>
    </div>
    <a class="border border-red-600 rounded-md py-2 px-5"
       href="https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=oe33kkiax4rchm0eelzlbradrr8zur&redirect_uri=http://localhost:5173&scope=">Login
      with Twitch</a>
    <router-link to="/chat">chat</router-link>
    <div>{{ response }}</div>
  </div>

</template>

<script setup>
import {ChatBubbleLeftRightIcon as Logo} from '@heroicons/vue/24/solid'
import {onBeforeMount, ref} from "vue";
import {useAppStore} from "@/stores/app.js";
import axios from "axios";

const appStore = useAppStore();

const response = ref()

onBeforeMount(async () => {
  if (document.location.hash && document.location.hash.length > 14) {
    appStore.set_token(document.location.hash.split('&')[0].slice(14))
  }

  /*
  response.value = await axios.get("https://api.twitch.tv/helix/users?login=papaplatte", {
    headers: {
      'Authorization': `Bearer ${appStore.token}`,
      'Client-Id': 'oe33kkiax4rchm0eelzlbradrr8zur'
    }
  })
   */

})
</script>Ï