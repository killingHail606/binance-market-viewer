<script setup lang="ts">
import { init, dispose, type Chart } from 'klinecharts'
import { PriceChangeType, type TickerData } from '~/types/market'

const props = defineProps<{
  symbol: string
  data: TickerData
}>()
const emit = defineEmits<{
  (e: 'remove', symbol: string): void
}>()

// Used to generate unique IDs for each chart component instance (e.g. for multiple candlestick charts on the same page)
const componentId = useId()

const chart = ref<Chart | null>(null)

watch(props.data, () => {
  chart.value?.applyNewData(props.data.candlestick)
})

onMounted(() => {
  chart.value = init(`chart-${componentId}`)
})

onUnmounted(() => {
  dispose('chart')
})
</script>

<template>
  <UCard>
    <template #header>
      <header class="flex justify-between">
        <div>
          <h3 class="text-xl font-bold flex gap-2 items-center">
            <UAvatar :text="symbol.slice(0, 2)" size="sm" />
            {{ symbol }}
          </h3>

          <dl class="mt-2 space-y-1">
            <div>
              <dt class="inline font-normal mr-2">Price:</dt>
              <dd
                class="inline font-medium"
                :class="{
                  'text-green-500': data.priceChange === PriceChangeType.UP,
                  'text-red-500': data.priceChange === PriceChangeType.DOWN,
                }"
              >
                {{ data.price }}
              </dd>
            </div>

            <div>
              <dt class="inline font-normal mr-2">Price change (24h):</dt>
              <dd
                class="inline font-medium"
                :class="{
                  'text-green-500': data.priceChangePercent > 0,
                  'text-red-500': data.priceChangePercent < 0,
                }"
              >
                {{ data.priceChangePercent }}%
              </dd>
            </div>
          </dl>
        </div>

        <UButton class="cursor-pointer h-[30px]" color="error" @click="emit('remove', symbol)">
          <Icon name="material-symbols-light:close" />
        </UButton>
      </header>
    </template>

    <div class="relative">
      <div :id="`chart-${componentId}`" class="h-[400px]" />
      <Icon
        v-show="!data.candlestick.length"
        name="eos-icons:bubble-loading"
        class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-4xl"
      ></Icon>
    </div>
  </UCard>
</template>

<style scoped></style>
