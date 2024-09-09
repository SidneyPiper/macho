<template>
  <div id="app" class="h-screen flex flex-col items-stretch dark:bg-stone-950 dark:text-stone-200">
    <ControlPanel class="shrink-0 px-2"/>
    <TwitchChat class="grow px-2"/>
  </div>
</template>

<script setup>
import TwitchChat from '@/components/TwitchChat.vue'
import ControlPanel from '@/components/ControlPanel.vue'
</script>
