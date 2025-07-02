<script setup lang="ts">
definePageMeta({
  ssr: false,
})

const marketStore = useMarketStore()

const searchPairs = computed(() => {
  return marketStore.allPairs.map((item) => ({
    label: item.displayName,
    value: item.symbol,
  }))
})

onMounted(async () => {
  await marketStore.fetchPairs()
})
</script>

<template>
  <UContainer>
    <h2 class="text-xl mb-2">Trading pairs:</h2>
    <VirtualSelect v-model="marketStore.selectedSymbols" :options="searchPairs" :loading="!searchPairs.length" />

    <div class="mt-5">
      <h2 class="text-xl mb-3">
        Selected Trading Pairs

        <Icon
          v-if="marketStore.selectedSymbols.length !== Object.keys(marketStore.tickers).length"
          name="eos-icons:bubble-loading"
        ></Icon>
      </h2>
      <ClientOnly>
        <div class="grid grid-cols-2 gap-4">
          <TradingPairCard
            v-for="(tickerData, tickerName) in marketStore.tickers"
            :key="tickerName"
            :symbol="tickerName"
            :data="tickerData"
            @remove="(symbol) => marketStore.removePair(symbol)"
          />
        </div>
      </ClientOnly>
    </div>
  </UContainer>
</template>

<style scoped></style>
