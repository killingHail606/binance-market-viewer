import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const isDarkMode = ref<boolean>(false)

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  return {
    isDarkMode,
    toggleTheme,
    loadTheme,
  }
})
