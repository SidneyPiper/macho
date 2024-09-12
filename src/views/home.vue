<template>
  <div class="h-dvh w-dvw flex flex-col items-center justify-center gap-8 bg-stone-950 pb-28">
    <div class="flex gap-1 items-center text-white">
      <Logo class="w-28 h-28"/>
      <p class="font-bold text-6xl">Macho</p>
    </div>
    <a class="rounded-md py-2 px-5 bg-[#9146FF] flex text-white gap-4 items-center"
       href="https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=oe33kkiax4rchm0eelzlbradrr8zur&redirect_uri=https://192.168.178.64:8080&scope=">
      <div class="w-6 h-6">
        <svg viewBox="0 0 512 512">
          <path fill="#ffffff"
                d="M391.2 103.5H352.5v109.7h38.6zM285 103H246.4V212.8H285zM120.8 0 24.3 91.4V420.6H140.1V512l96.5-91.4h77.3L487.7 256V0zM449.1 237.8l-77.2 73.1H294.6l-67.6 64v-64H140.1V36.6H449.1z"/>
        </svg>
      </div>
      Login with Twitch</a>
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