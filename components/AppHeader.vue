<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import { onMounted } from 'vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.loadTheme()
})
</script>

<template>
  <header>
    <UContainer class="py-4">
      <div class="flex justify-between">
        <h1 class="font-bold text-2xl">Binance Market Viewer</h1>

        <UButton @click="appStore.toggleTheme" color="neutral" class="cursor-pointer">
          <Icon v-if="appStore.isDarkMode" name="material-symbols:light-mode" />
          <Icon v-else name="material-symbols:dark-mode" />
        </UButton>
      </div>
    </UContainer>
  </header>
</template>

<style scoped></style>
