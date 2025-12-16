<script setup>
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  authStore.loadFromStorage()
</script>

<template>
  <router-view />
</template>
