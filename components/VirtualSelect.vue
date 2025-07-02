<!-- components/VirtualSelect.vue -->
<script setup lang="ts">
import { vOnClickOutside } from '@vueuse/components'
// @ts-ignore no types
import { RecycleScroller } from 'vue-virtual-scroller'

const props = defineProps<{
  options: { label: string; value: string; icon?: string }[]
  loading: boolean
}>()

const model = defineModel<string[]>({ default: [] })

const isShowDropdown = ref(false)
const search = ref('')
const filtered = computed(() => props.options.filter((o) => o.label.toLowerCase().includes(search.value.toLowerCase())))

function toggleItem(itemValue: string) {
  const set = new Set(model.value)
  if (set.has(itemValue)) {
    set.delete(itemValue)
  } else {
    set.add(itemValue)
  }

  model.value = Array.from(set)
}

function onClickOutside() {
  isShowDropdown.value = false
  search.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-2 relative" v-on-click-outside="onClickOutside">
    <UInput
      v-model="search"
      @focusin="isShowDropdown = true"
      placeholder="Search..."
      size="xl"
      class="w-full"
      icon="i-lucide-search"
      :loading="loading"
      :disabled="loading"
    />

    <div v-if="model.length" class="flex gap-2">
      <UButton color="error" @click="model = []" class="cursor-pointer">Clear all</UButton>
      <UBadge v-for="selected in model" :key="selected" class="hover:bg-yellow">
        {{ selected }}
        <UButton class="cursor-pointer" @click="toggleItem(selected)">
          <Icon name="material-symbols-light:close" />
        </UButton>
      </UBadge>
    </div>

    <UCard v-show="isShowDropdown" class="[&>div]:p-1 absolute bottom-[-316px] w-full z-10">
      <RecycleScroller
        :items="filtered"
        :item-size="48"
        key-field="value"
        v-slot="{ item }"
        class="h-[300px] overflow-auto"
      >
        <div
          @click="toggleItem(item.value)"
          class="h-[48px] cursor-pointer px-3 rounded flex justify-between items-center"
          :class="model.includes(item.value) ? 'bg-gray-100 dark:bg-gray-800' : ''"
        >
          <div class="flex gap-2 items-center">
            <UAvatar :text="item.label.slice(0, 2)" size="sm" />

            <span class="">{{ item.label }}</span>
          </div>

          <Icon v-if="model.includes(item.value)" name="material-symbols:check-rounded" />
        </div>
      </RecycleScroller>
    </UCard>
  </div>
</template>
