<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex gap-1">
      <Logo class="w-6 h-6"/>
      <p class="font-semibold">Macho</p>
    </div>
    <a class="border border-red-600 rounded-md py-2 px-5"
       href="https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=oe33kkiax4rchm0eelzlbradrr8zur&redirect_uri=http://localhost:5173&scope=">Login
      with Twitch</a>
  </div>
</template>

<script setup>
import {ChatBubbleLeftRightIcon as Logo} from '@heroicons/vue/24/solid'
import {onBeforeMount} from "vue";
import {useRouter} from "vue-router";
import {set_token} from "@/stores/token.js";

const router = useRouter();

onBeforeMount(async () => {
  const hash = document.location.hash
  const params = new URLSearchParams(hash.substring(1))
  const access_token = params.get("access_token")

  if (access_token) {
    set_token(access_token)
    await router.push('chat')
  }
})
</script>Ï